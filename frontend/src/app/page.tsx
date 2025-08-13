import {
  FolderOpen,
  LayoutTemplate,
  CalendarDays,
  ChevronRight,
} from "lucide-react"; // Ícones para um visual mais limpo. Instale com: npm install lucide-react

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <main>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-400">
            Dê vida às suas ideias. Organize seu mundo.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            A plataforma definitiva para criar, planejar e colaborar. De notas
            rápidas a projetos complexos, tudo em um só lugar.
          </p>
          <a
            href="/signup"
            className="mt-8 inline-flex items-center justify-center px-8 py-3 font-medium text-white bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600 transition-colors duration-300"
          >
            Comece Agora, é Grátis
            <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </section>

        <section id="features" className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Tudo que você precisa para se manter produtivo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Workspaces */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <FolderOpen className="w-10 h-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Workspaces Infinitos
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Crie uma hierarquia que faz sentido para você. De projetos a
                  anotações pessoais, estruture tudo com total liberdade e
                  profundidade.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <LayoutTemplate className="w-10 h-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Cards Inteligentes
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Cada card é uma página em branco com um editor de texto
                  poderoso. Adicione listas, imagens, links e formate como
                  quiser.
                </p>
              </div>

              {/* Feature 3: Calendário Semanal */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <CalendarDays className="w-10 h-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Calendário Integrado
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Visualize sua semana, planeje suas tarefas e nunca mais perca
                  um prazo. Arraste e solte seus cards diretamente no
                  calendário.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Visual Showcase */}
        <section className="py-20 px-4">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="pr-8">
              <span className="text-indigo-500 font-semibold">
                FLUXO DE TRABALHO INTUITIVO
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Centralize seu conhecimento
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Pare de pular entre dezenas de apps. Com workspaces aninhados,
                você pode ter a página do seu projeto principal e, dentro dela,
                páginas para reuniões, brainstorms e listas de tarefas. Tudo
                conectado e fácil de achar.
              </p>
            </div>
            {/* Simulação da UI */}
            <div className="bg-white dark:bg-zinc-800/50 p-4 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1.5"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg">
                <p className="font-mono text-sm font-semibold">
                  📂 Projeto Alpha
                </p>
                <div className="ml-4 mt-2 border-l-2 border-zinc-300 dark:border-zinc-600 pl-4 space-y-2">
                  <p className="font-mono text-sm">📄 Reunião de Kick-off</p>
                  <div className="font-mono text-sm bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded">
                    <p className="font-bold">📝 Card de Tarefas</p>
                    <p className="mt-1 pl-2 text-xs text-zinc-700 dark:text-zinc-300">
                      - [x] Definir escopo
                    </p>
                    <p className="pl-2 text-xs text-zinc-700 dark:text-zinc-300">
                      - [ ] Alocar recursos
                    </p>
                  </div>
                  <p className="font-mono text-sm">📅 Calendário de Entregas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Final CTA */}
        <section className="bg-indigo-500 text-white my-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold">
              Pronto para organizar sua vida digital?
            </h2>
            <p className="mt-2 text-indigo-100 max-w-xl mx-auto">
              Crie sua conta gratuita hoje mesmo e transforme o caos em clareza.
            </p>
            <a
              href="/signup"
              className="mt-8 inline-block px-10 py-3 font-semibold text-indigo-500 bg-white rounded-lg shadow-md hover:bg-zinc-100 transition-colors"
            >
              Quero me organizar
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>
              &copy; {new Date().getFullYear()} SeuSistema Inc. Todos os
              direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-500 transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors">
                Privacidade
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
