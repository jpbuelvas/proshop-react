import { useRef, useState, useEffect } from "react";

import { THEME } from "../data/products";
import Media from "./Media";
import ProductCard from "./ProductCard";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const TruckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="m16 8 4 0 3 6v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ReturnIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const StarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TRUST_ICONS = [TruckIcon, ReturnIcon, ShieldIcon, StarIcon];

function Carousel({ items }) {
  const ref = useRef(null);
  const drag = useRef(null);

  const onDown = (e) => {
    const el = ref.current;
    if (!el) return;
    drag.current = { el, x: e.clientX, sl: el.scrollLeft, down: true };
    el.style.cursor = "grabbing";
  };
  const onMove = (e) => {
    if (!drag.current || !drag.current.down) return;
    drag.current.el.scrollLeft = drag.current.sl - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    if (drag.current) {
      drag.current.down = false;
      if (drag.current.el) drag.current.el.style.cursor = "grab";
    }
  };
  const by = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(580, el.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          padding: "14px clamp(24px, 5vw, 60px) 12px",
        }}
      >
        <ArrowButton onClick={() => by(-1)}>←</ArrowButton>
        <ArrowButton onClick={() => by(1)}>→</ArrowButton>
      </div>
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          cursor: "grab",
          background: "#e8e8e8",
          padding: "0 clamp(24px, 5vw, 60px) 3px",
        }}
      >
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              flex: "0 0 clamp(220px, 32vw, 268px)",
              scrollSnapAlign: "start",
            }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </>
  );
}

function ArrowButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 42,
        height: 42,
        background: "#111",
        color: "#fff",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#444")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
    >
      {children}
    </button>
  );
}

function Hero({ onCta, onCta2 }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "22fr 78fr",
        minHeight: isMobile ? "85svh" : "92vh",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <div
          style={{
            background: "#090909",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(22px, 3.5vw, 44px)",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(-55deg, transparent, transparent 28px, rgba(255,255,255,0.013) 28px, rgba(255,255,255,0.018) 30px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: 9.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              COLECCIÓN
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 5vw, 5rem)",
                color: "rgba(255,255,255,0.07)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              2026
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: 9.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                fontWeight: 700,
                height: 130,
              }}
            >
              ROPA DEPORTIVA
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          background: "#111",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile
            ? "clamp(48px, 10vw, 72px) clamp(24px, 6vw, 48px)"
            : "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 52px)",
          overflow: "hidden",
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(-55deg, transparent, transparent 38px, rgba(255,255,255,0.012) 38px, rgba(255,255,255,0.016) 41px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-6%",
            top: "50%",
            transform: "translateY(-50%)",
            width: isMobile ? "90%" : "66%",
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 1,
            filter: "grayscale(1)",
          }}
        >
          <Media src="/proshopLogo.avif" alt="" />
        </div>
        <div
          className="hero-animate"
          style={{ position: "relative", zIndex: 3, textAlign: "center", width: "100%" }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: isMobile ? 9.5 : 10.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 18,
              fontWeight: 700,
            }}
          >
            ROPA DEPORTIVA · AUDIO · ACCESORIOS
          </div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: isMobile
                ? "clamp(3.2rem, 16vw, 5.5rem)"
                : "clamp(4.5rem, 9vw, 9.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#fff",
              margin: "0 0 20px",
            }}
          >
            EQUÍPATE
            <br />
            PARA
            <br />
            GANAR
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.48)",
              fontSize: isMobile ? 14 : "clamp(13px, 1.5vw, 15.5px)",
              lineHeight: 1.65,
              maxWidth: "34ch",
              margin: "0 auto 28px",
            }}
          >
            Ropa deportiva, audio premium y accesorios para rendir al máximo.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={onCta}
              style={{
                background: "#fff",
                color: "#111",
                fontWeight: 700,
                fontSize: 13.5,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "15px 32px",
                border: "2px solid #fff",
                transition: "background 0.12s",
                width: isMobile ? "100%" : undefined,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e8e8e8")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              COMPRAR AHORA →
            </button>
            <button
              onClick={onCta2}
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13.5,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "15px 32px",
                transition: "all 0.12s",
                width: isMobile ? "100%" : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              VER OFERTAS
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

export default function Home({ data }) {
  const {
    spotlight,
    trust,
    offerItems,
    bestItems,
    editTabs,
    editItems,
    editCampaignTitle,
    editCampaignSub,
    editCampaignLink,
    onEditAll,
    onOffersAll,
    onBestAll,
    onHeroCta,
    onHeroCta2,
    onCampaignShop,
  } = data;

  const editRevealRef = useReveal();
  const spotlightRevealRef = useReveal();
  const campaignRevealRef = useReveal();
  const offersRevealRef = useReveal();
  const bestRevealRef = useReveal();

  return (
    <>
      <Hero onCta={onHeroCta} onCta2={onHeroCta2} />

      {/* Editorial carousel */}
      <section
        style={{ background: "#fff", padding: "clamp(40px, 6vw, 68px) 0 0" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 60px)",
          }}
        >
          <div
            ref={editRevealRef}
            className="reveal"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#767676",
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                {editCampaignSub}
              </div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.8rem, 4.2vw, 3.2rem)",
                  textTransform: "uppercase",
                  margin: 0,
                  lineHeight: 1,
                  color: "#111",
                }}
              >
                {editCampaignTitle}
              </h2>
            </div>
            <button
              onClick={onEditAll}
              style={{
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#111",
                borderBottom: "1.5px solid #111",
                paddingBottom: 1,
                whiteSpace: "nowrap",
                transition: "color 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#767676")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
            >
              {editCampaignLink}
            </button>
          </div>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {editTabs.map((et, i) => (
              <button
                key={i}
                onClick={et.onClick}
                style={{
                  padding: "9px 20px",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  border: `1.5px solid ${et.active ? "#111" : "#c4c4c4"}`,
                  background: et.active ? "#111" : "transparent",
                  color: et.active ? "#fff" : "#111",
                  transition: "all 0.14s",
                  boxShadow: et.active ? "inset 0 -3px 0 #c8102e" : "none",
                }}
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>
        <Carousel items={editItems} />
      </section>

      {/* Audio Spotlight */}
      <section
        style={{
          background: "#111",
          color: "#fff",
          padding: "clamp(52px, 8vw, 96px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diagonal stripe — textura de marca */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(-55deg, transparent, transparent 36px, rgba(255,255,255,0.012) 36px, rgba(255,255,255,0.016) 39px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Vignette — oscurece bordes, concentra la mirada en el contenido */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(0,0,0,0.52) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Halo frío desde la derecha — sugiere presencia del producto */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 80% at 88% 50%, rgba(38,20,150,0.1), transparent)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 60px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(36px, 6vw, 72px)",
              alignItems: "center",
            }}
          >
            <div ref={spotlightRevealRef} className="reveal">
              <span
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.68)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "6px 15px",
                  marginBottom: 22,
                }}
              >
                NUEVO · AUDIO PREMIUM
              </span>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  margin: "0 0 18px",
                }}
              >
                SONIDO
                <br />
                QUE SE
                <br />
                SIENTE
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.56)",
                  fontSize: "clamp(14px, 1.7vw, 16.5px)",
                  lineHeight: 1.65,
                  maxWidth: "42ch",
                  margin: "0 0 20px",
                }}
              >
                Cancelación de ruido activa, audio Hi-Fi y hasta 20 horas de
                batería. Para mover tu mundo.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 30,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                    color: "#fff",
                  }}
                >
                  {spotlight.price}
                </span>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "rgba(255,255,255,0.36)",
                    fontSize: 17,
                  }}
                >
                  {spotlight.old}
                </span>
                <span
                  style={{
                    background: THEME.sale,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "5px 11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {spotlight.disc}
                </span>
              </div>
              <button
                onClick={spotlight.onView}
                style={{
                  background: "#fff",
                  color: "#111",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  border: "2px solid #fff",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e8e8e8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                VER PRODUCTO →
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
              }}
            >
              <div
                className="float-animate"
                style={{
                  width: "min(100%, 500px)",
                  filter: "drop-shadow(0 44px 64px rgba(0,0,0,0.78))",
                }}
              >
                <Media src="/airpodsMax.webp" alt="Audífonos Max" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign banner — white background breaks consecutive dark sections */}
      <section
        style={{
          background: "#fff",
          color: "#111",
          overflow: "hidden",
          position: "relative",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(56px, 8vw, 88px) clamp(24px, 5vw, 60px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div ref={campaignRevealRef} className="reveal" style={{ maxWidth: 640 }}>
            <span
              style={{
                display: "inline-block",
                border: "1px solid rgba(0,0,0,0.15)",
                color: "rgba(0,0,0,0.48)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "5px 14px",
                marginBottom: 24,
              }}
            >
              NUEVA COLECCIÓN · 2026
            </span>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3.2rem, 7.5vw, 6.5rem)",
                lineHeight: 0.86,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                margin: "0 0 22px",
                color: "#111",
              }}
            >
              MUÉVETE
              <br />
              SIN
              <br />
              LÍMITES
            </h2>
            <p
              style={{
                color: "rgba(0,0,0,0.52)",
                fontSize: "clamp(14px, 1.6vw, 16px)",
                lineHeight: 1.65,
                maxWidth: "44ch",
                margin: "0 0 32px",
              }}
            >
              Ropa diseñada para el movimiento real. Materiales técnicos, cortes
              ergonómicos y estilo sin concesiones.
            </p>
            <button
              onClick={onCampaignShop}
              style={{
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13.5,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "15px 34px",
                border: "2px solid #111",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#333")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
            >
              VER ROPA DEPORTIVA →
            </button>
          </div>
        </div>
      </section>

      {/* Offers carousel */}
      <section
        style={{ background: "#f5f5f5", padding: "clamp(40px, 6vw, 68px) 0" }}
      >
        <div style={{ width: "100%", maxWidth: 1240, margin: "0 auto" }}>
          <div
            ref={offersRevealRef}
            className="reveal"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 22,
              padding: "0 clamp(24px, 5vw, 60px)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#767676",
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                TIEMPO LIMITADO
              </div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  margin: 0,
                  color: "#111",
                }}
              >
                OFERTAS DE LA SEMANA
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={onOffersAll}
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#111",
                  borderBottom: "1.5px solid #111",
                  paddingBottom: 1,
                  transition: "color 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#767676")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
              >
                VER TODO →
              </button>
            </div>
          </div>
          <Carousel items={offerItems} />
        </div>
      </section>

      {/* Best Sellers */}
      <section
        style={{ background: "#fff", padding: "clamp(40px, 6vw, 68px) 0" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 60px)",
          }}
        >
          <div
            ref={bestRevealRef}
            className="reveal"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 26,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#767676",
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                FAVORITOS DE LA COMUNIDAD
              </div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  margin: 0,
                  color: "#111",
                }}
              >
                LOS MÁS VENDIDOS
              </h2>
            </div>
            <button
              onClick={onBestAll}
              style={{
                fontWeight: 700,
                fontSize: 13.5,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#111",
                borderBottom: "1.5px solid #111",
                paddingBottom: 1,
                transition: "color 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#767676")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
            >
              VER TODO →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 1,
              background: "#e0e0e0",
            }}
          >
            {bestItems.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section
        style={{
          background: "#000",
          color: "#fff",
          padding: "clamp(20px, 3vw, 30px) 0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 60px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {trust.map((tr, i) => {
              const Icon = TRUST_ICONS[i] || TRUST_ICONS[0];
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    padding: "clamp(16px, 2.5vw, 20px) clamp(16px, 2.5vw, 22px)",
                    borderRight: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ color: THEME.sale, flexShrink: 0, lineHeight: 1 }}>
                    <Icon />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        lineHeight: 1.2,
                      }}
                    >
                      {tr.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.48)",
                        marginTop: 2,
                      }}
                    >
                      {tr.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
