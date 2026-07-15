import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactItem from '@/shared/components/contact-item';
import SocialLink from '@/shared/components/social-link';
import { FormContact } from '@/shared/components/form-contact';
import { useReveal } from '@/shared/hooks/use-reveal';

const Contact: React.FC = () => {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`reveal ${isRevealed ? 'is-revealed' : ''} container mx-auto px-4 md:px-6`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-16">
            {/* Número-fantasma editorial atrás do título */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-8 -left-1 font-display text-8xl md:text-9xl font-bold leading-none text-slate-800/40"
            >
              03
            </span>
            <div className="relative">
              <span className="eyebrow mb-4">03 <span className="accent-rule" /> Contato</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Entre em Contato
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl">
                Tenho uma boa maneira de falar com você, seja por e-mail ou telefone.
                Estou sempre aberto a novas oportunidades de trabalho e colaboração.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-lg border border-slate-800 bg-slate-900/40 p-6 sm:p-8 transition-colors hover:border-slate-700`}>
              <h3 className="text-2xl font-bold mb-6">Informação de Contato</h3>

              <div className="space-y-6">
                <ContactItem
                  icon={<Mail className="text-accent-400" />}
                  title="Email"
                  detail={<a href="mailto:vittorsantos234@gmail.com" className="hover:text-accent-300 transition-colors">vittorsantos234@gmail.com</a>}
                />
                <ContactItem
                  icon={<Phone className="text-accent-400" />}
                  title="Telefone"
                  detail="+55 (77) 98131-4622"
                />
                <ContactItem
                  icon={<MapPin className="text-accent-400" />}
                  title="Local"
                  detail="Bahia - BR"
                />
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-slate-200">Redes Sociais</h4>
                <div className="flex space-x-4">
                  <SocialLink href="https://github.com/JoaoVittorL" label="GitHub" />
                  <SocialLink href="https://www.linkedin.com/in/jo%C3%A3o-vittor-lopes-dos-santos-199103201" label="LinkedIn" />
                  <SocialLink href="https://wa.me/5577981314622?text=Ol%C3%A1%2C%20Jo%C3%A3o!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar." label="WhatsApp" />
                </div>
              </div>
            </div>

            <div
              className={`reveal ${isRevealed ? 'is-revealed' : ''} rounded-lg border border-slate-800 bg-slate-900/40 p-6 sm:p-8 transition-colors hover:border-slate-700`}
              style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            >
              <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>

              <FormContact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
