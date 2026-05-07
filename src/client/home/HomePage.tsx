// src/client/home/HomePage.tsx
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/core/lib/prisma";
import { siteConfig } from "@/client/config/site.config";

export default async function HomePage() {
  const categories = await prisma.blogCategory.findMany({
    where: { showOnHome: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <main
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* HERO */}
      <section
        className="w-full overflow-hidden"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[50px] md:pt-[80px] pb-10 md:pb-16">
          <div className="grid lg:grid-cols-2 items-center gap-8 md:gap-12">
            <div className="order-2 lg:order-1 max-w-[560px]">
              <p
                className="uppercase tracking-[0.28em] text-[10px] sm:text-xs mb-3 md:mb-4"
                style={{
                  color: "var(--color-accent-hover)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Crochê contemporâneo
              </p>

              <h1
                className="text-[2rem] sm:text-[2.5rem] md:text-[3.8rem] leading-[1.02] mb-4 md:mb-5"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-logo)",
                }}
              >
                Crochê feminino artesanal: bolsas, tops e vestidos feitos à mão
              </h1>

              <p
                className="text-[0.95rem] sm:text-base md:text-lg leading-7 max-w-[32rem] mb-6 md:mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Compre online peças de crochê artesanal com design autoral, produção cuidadosa e entrega para todo o Brasil.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
                <Link
                  href="/loja"
                  className="inline-flex items-center justify-center px-7 md:px-8 py-3.5 md:py-4 rounded-full text-[12px] md:text-sm uppercase tracking-[0.16em] transition hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-success)",
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Ver coleção
                </Link>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 md:px-8 py-3.5 md:py-4 rounded-full text-[12px] md:text-sm uppercase tracking-[0.16em] transition"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-accent-light) 45%, white)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Fazer encomenda
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-1">
                {[
                  {
                    title: "Feito à mão",
                    desc: "Com amor e dedicação",
                  },
                  {
                    title: "Peças exclusivas",
                    desc: "Produção limitada",
                  },
                  {
                    title: "Entregamos no Brasil",
                    desc: "Para todo o país",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full shrink-0 mt-0.5"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-accent-light) 55%, white)",
                      }}
                    />
                    <div>
                      <p
                        className="text-[13px] md:text-sm leading-tight mb-1"
                        style={{
                          color: "var(--color-text-primary)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[12px] md:text-xs leading-5"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative w-full h-[300px] sm:h-[380px] md:h-[520px]">
                <div className="absolute inset-0 lg:left-[8%] rounded-[24px] md:rounded-[34px] overflow-hidden">
                  <Image
                    src="/hero-maribela.jpg"
                    alt="Maribela — Crochê contemporâneo artesanal"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </div>

                <div
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-36 h-36 lg:w-40 lg:h-40 rounded-full border bg-white/70 backdrop-blur-sm items-center justify-center"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-accent-hover) 45%, transparent)",
                  }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.24em] leading-relaxed text-center px-5"
                    style={{
                      color: "var(--color-accent-hover)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Amor e dedicação em cada laçada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSAS COLEÇÕES */}
<section
  className="py-20 px-6 border-t"
  style={{
    backgroundColor: "var(--color-bg-primary)",
    borderColor: "var(--color-border)",
  }}
>
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-10 xl:gap-14 items-start">
      <div className="lg:pt-2">
        <p
          className="uppercase tracking-[0.25em] text-xs mb-3"
          style={{
            color: "var(--color-accent-hover)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Nossas coleções
        </p>

        <h2
          className="text-3xl md:text-4xl leading-tight mb-4"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-logo)",
          }}
        >
          Estilo, conforto e personalidade em cada detalhe
        </h2>

        <p
          className="text-sm md:text-base leading-7 mb-7"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Looks fresquinhos, confortáveis e feitos à mão para te acompanhar em
          todos os momentos com leveza e autenticidade.
        </p>

        <Link
          href="/loja"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.18em] transition"
          style={{
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
            backgroundColor: "var(--color-bg-card)",
          }}
        >
          Ver todas as peças
          <span>→</span>
        </Link>
      </div>

      <div className="min-w-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tops", count: "12 peças", image: "/colecao-top.jpg" },
            { label: "Blusas", count: "18 peças", image: "/colecao-blusa.jpg" },
            {
              label: "Acessórios",
              count: "24 peças",
              image: "/colecao-acessorio.jpg",
            },
            {
              label: "Vestidos",
              count: "10 peças",
              image: "/colecao-vestido.jpg",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href="/loja"
              className="group rounded-[22px] overflow-hidden"
              style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
              }}
            >
              <div className="relative h-40 md:h-52">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>

              <div className="px-4 py-3">
                <p
                  className="text-sm mb-1"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
      {/* BENEFÍCIOS PRINCIPAIS */}
<section
  className="py-24 px-6 border-t"
  style={{
    backgroundColor: "var(--color-bg-card)",
    borderColor: "var(--color-border)",
  }}
>
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-16">
      <p
        className="uppercase tracking-[0.25em] text-xs mb-3"
        style={{
          color: "var(--color-accent-hover)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Por que escolher a Maribela?
      </p>

      <h2
        className="text-3xl md:text-4xl leading-tight"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-logo)",
        }}
      >
        Crochê que vai além da moda
      </h2>
    </div>

    <div className="grid md:grid-cols-4 gap-8">
      {[
        {
          title: "Feito à mão",
          desc: "Cada peça é criada artesanalmente com cuidado e atenção.",
          icon: Heart,
        },
        {
          title: "Design exclusivo",
          desc: "Peças autorais com estética contemporânea e atemporal.",
          icon: Sparkles,
        },
        {
          title: "Fios de qualidade",
          desc: "Selecionamos os melhores fios para garantir conforto e durabilidade.",
          icon: ShieldCheck,
        },
        {
          title: "Entrega segura",
          desc: "Enviamos para todo o Brasil com embalagem especial e carinho.",
          icon: Truck,
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="text-center px-4">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-accent-light) 32%, white)",
                color: "var(--color-accent-hover)",
              }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <h3
              className="text-lg mb-3"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {item.title}
            </h3>

            <p
              className="text-sm leading-7"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* BLOG */}
      {categories.length > 0 && (
        <section
          className="py-24 px-6"
          style={{
            backgroundColor: "var(--color-bg-primary)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-10">
              <div className="text-left">
                <p
                  className="uppercase tracking-[0.25em] text-xs mb-3"
                  style={{
                    color: "var(--color-accent-hover)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Inspirações
                </p>

                <h2
                  className="text-3xl md:text-4xl"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-logo)",
                  }}
                >
                  Dicas, tendências e muito mais
                </h2>
              </div>

              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-bg-card)",
                }}
              >
                Ver todos os artigos
                <span>→</span>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/categoria/${cat.slug}`}
                  className="group rounded-[24px] overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                    border: "1px solid color-mix(in srgb, var(--color-border) 65%, white)",
                  }}
                >
                  <div
                    className="h-48 flex items-end p-5"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 55%, white), color-mix(in srgb, var(--color-accent-hover) 55%, white))",
                    }}
                  >
                    <span
                      className="uppercase text-[11px] tracking-[0.25em] px-3 py-1 rounded-full bg-white/80"
                      style={{
                        color: "var(--color-accent-hover)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Maribela Blog
                    </span>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-xl mb-2"
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {cat.name}
                    </h3>

                    <p
                      className="text-sm leading-7 mb-4"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {cat.description ??
                        "Explore conteúdos exclusivos da Maribela."}
                    </p>

                    <p
                      className="mt-2 text-xs uppercase tracking-[0.18em]"
                      style={{
                        color: "var(--color-accent-hover)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Ler artigos →
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 md:hidden flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.18em] transition"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                  backgroundColor: "var(--color-bg-card)",
                }}
              >
                Ver todos os artigos
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* INSTAGRAM */}
<section
  className="py-16 md:py-20 px-4 sm:px-6"
  style={{ backgroundColor: "var(--color-bg-primary)" }}
>
  <div
    className="max-w-7xl mx-auto rounded-[28px] md:rounded-[32px] overflow-hidden border"
    style={{
      background:
        "linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 82%, white), color-mix(in srgb, var(--color-accent) 65%, white))",
      borderColor: "color-mix(in srgb, var(--color-border) 70%, white)",
      boxShadow: "0 18px 50px rgba(62,44,35,0.08)",
    }}
  >
    <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 p-5 md:p-7 lg:p-8 items-center">
      <div className="max-w-[240px]">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-accent-hover) 90%, white)",
              color: "var(--color-text-light)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            </svg>
          </div>

          <div>
            <p
              className="text-sm leading-none"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              @maribela
            </p>
          </div>
        </div>

        <p
          className="text-sm md:text-[15px] leading-6 mb-5"
          style={{
            color: "rgba(255,255,255,.92)",
            fontFamily: "var(--font-body)",
          }}
        >
          Siga no Instagram e inspire-se todos os dias com looks reais,
          bastidores e novidades.
        </p>

        <a
          href={`https://instagram.com/${siteConfig.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm transition hover:opacity-90"
          style={{
            backgroundColor: "var(--color-text-light)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Seguir no Instagram
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {[
          "/insta-1.jpg",
          "/insta-2.jpg",
          "/insta-3.jpg",
          "/insta-4.jpg",
          "/insta-5.jpg",
          "/insta-6.jpg",
        ].map((src, index) => (
          <div
            key={src}
            className="relative aspect-[4/5] rounded-[18px] overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,.35)",
              border: "1px solid rgba(255,255,255,.45)",
            }}
          >
            <Image
              src={src}
              alt={`Foto do Instagram ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* CTA FINAL */}
      <section
        className="py-24 px-6 text-center"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-accent-light) 45%, white)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="uppercase tracking-[0.25em] text-xs mb-4"
            style={{
              color: "var(--color-accent-hover)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Maribela
          </p>

          <h2
            className="text-3xl md:text-4xl leading-tight mb-5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-logo)",
            }}
          >
            Amor e dedicação em cada laçada
          </h2>

          <p
            className="text-base md:text-lg leading-8 mb-8"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Fale conosco pelo WhatsApp e encontre a peça perfeita para o seu
            estilo.
          </p>

          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 rounded-full text-sm uppercase tracking-[0.18em] transition hover:opacity-90"
            style={{
              backgroundColor: "var(--color-success)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}