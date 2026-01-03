import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { X, Navigation, Clock, Map as MapIcon, Loader2 } from "lucide-react";

// Fix Leaflet Default Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RoutingMachine = ({ points, setRouteInfo, setIsCalculating }) => {
    const map = useMap();
    const routingControlRef = React.useRef(null);

    useEffect(() => {
        if (!map || !points || points.length < 2) return;

        setIsCalculating(true);

        // Clean up previous control if exists
        if (routingControlRef.current) {
            try {
                map.removeControl(routingControlRef.current);
            } catch (e) {
                console.warn("Cleanup error", e);
            }
        }

        const waypoints = points.map((p) => L.latLng(p.lat, p.lng));

        const routingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: "#2563eb", weight: 6, opacity: 0.8 }],
            },
            createMarker: (i, wp, nWps) => {
                const event = points[i];
                if (!event) return null;

                const marker = L.marker(wp.latLng);

                const popupContent = `
                    <div class="min-w-[220px] font-sans">
                        <div class="relative h-32 w-full rounded-t-xl overflow-hidden bg-gray-100">
                            <img src="${event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                                 class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                                 style="display: block;"
                            />
                            <div class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-lg">
                                ${event.category || 'Event'}
                            </div>
                        </div>
                        <div class="bg-white p-4 rounded-b-xl shadow-sm border border-t-0 border-gray-100">
                            <h3 class="text-base font-black text-gray-900 leading-tight mb-2">${event.title}</h3>
                            <div class="flex items-center gap-2 text-gray-500 mb-3">
                                <span class="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    ${event.location}
                                </span>
                            </div>
                            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div>
                                    <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Date</p>
                                    <p class="text-xs font-bold text-gray-700">${event.date || 'TBA'}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Price</p>
                                    <p class="text-sm font-black text-blue-600">${event.price} TND</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                return marker.bindPopup(popupContent, {
                    className: 'itinerary-popup',
                    minWidth: 220,
                    maxWidth: 260
                });
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            show: false, // Hide default instructions panel
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving'
            })
        });

        routingControl.on("routesfound", function (e) {
            const routes = e.routes;
            if (routes && routes.length > 0) {
                const route = routes[0];

                // Robust summary extraction
                let totalDist = 0;
                let totalTime = 0;

                if (route.summary) {
                    totalDist = route.summary.totalDistance;
                    totalTime = route.summary.totalTime;
                } else {
                    // Fallback: sum up legs
                    if (route.legs) {
                        route.legs.forEach(leg => {
                            totalDist += leg.distance || 0;
                            totalTime += leg.time || 0; // OSRM usually provides 'duration' in legs but LRM maps it? Check docs.
                            // LRM IRouteLeg has distance (number). Time might be on summary only for OSRM.
                        });
                    }
                }

                setRouteInfo({
                    distance: (totalDist / 1000).toFixed(1), // km
                    time: Math.round(totalTime / 60), // minutes
                });
            }
            setIsCalculating(false);
        });

        routingControl.on("routingerror", function (e) {
            console.error("Routing error:", e);
            setIsCalculating(false);
            // Optional: fallback calculation could go here
        });

        routingControl.addTo(map);
        routingControlRef.current = routingControl;

        return () => {
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (e) {
                    console.warn("Cleanup error on unmount", e);
                }
            }
        };
    }, [map, points, setRouteInfo, setIsCalculating]);

    return (
        <React.Fragment>
            <style>
                {`
                .itinerary-popup .leaflet-popup-content-wrapper {
                    padding: 0;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .itinerary-popup .leaflet-popup-content {
                    margin: 0 !important;
                    width: 100% !important;
                }
                .itinerary-popup .leaflet-popup-tip {
                    background: white;
                }
                .itinerary-popup a.leaflet-popup-close-button {
                    color: white;
                    z-index: 10;
                    top: 10px;
                    right: 10px;
                }
                .itinerary-popup a.leaflet-popup-close-button:hover {
                    color: #eee;
                }
                `}
            </style>
        </React.Fragment>
    );
};

const ItineraryMap = ({ events, onClose }) => {
    const [routeInfo, setRouteInfo] = useState({ distance: 0, time: 0 });
    const [isCalculating, setIsCalculating] = useState(true);

    // Default center (Tunis) if no events
    const center = events.length > 0 ? [events[0].lat, events[0].lng] : [36.8065, 10.1815];

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-[401] p-6 flex justify-between items-start pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-xl pointer-events-auto border border-white/50">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <MapIcon className="text-blue-600" /> Your Itinerary
                        </h2>
                        <div className="flex items-center gap-6 mt-2 text-sm font-bold text-gray-500">
                            {isCalculating ? (
                                <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Calculating route...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Navigation size={16} className="text-green-500" />
                                        <span className="text-gray-900 text-lg">{routeInfo.distance} km</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-orange-500" />
                                        <span className="text-gray-900 text-lg">
                                            {Math.floor(routeInfo.time / 60)}h {routeInfo.time % 60}min
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-3 flex gap-2 overflow-x-auto max-w-md pb-1 scrollbar-hide">
                            {events.map((ev, i) => (
                                <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap">
                                    <span className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full text-[10px]">{i + 1}</span>
                                    {ev.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="bg-white p-4 rounded-full shadow-xl hover:scale-105 hover:bg-red-50 hover:text-red-500 transition-all pointer-events-auto"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Map */}
                <div className="w-full h-full relative z-[100]">
                    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <RoutingMachine
                            points={events}
                            setRouteInfo={setRouteInfo}
                            setIsCalculating={setIsCalculating}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMap;
