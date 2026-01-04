const Button = ({ text, className, scrollToId, link }) => {
  if (link) {
    return (
      <a href={link} className={`${className ?? ""} cta-wrapper`}>
        <div className="cta-button group">
          <div className="bg-circle" />
          <p className="text">{text}</p>
          <div className="arrow-wrapper">
            <img src="/images/arrow-down.svg" alt="arrow" className="rotate-[270deg]" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`#${scrollToId}`}
      onClick={(e) => {
        e.preventDefault();

        const target = document.getElementById(scrollToId);
        if (!target) return;

        // Scroll to the middle of the section, minus 10px
        const top =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          window.innerHeight / 2 +
          target.offsetHeight / 2 -
          10; // 10px upwards

        window.scrollTo({ top, behavior: "smooth" });
      }}
      className={`${className ?? ""} cta-wrapper`}
    >
      <div className="cta-button group">
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="/images/arrow-down.svg" alt="arrow" />
        </div>
      </div>
    </a>
  );
};

export default Button;
