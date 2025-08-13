import LinkComponent from "@/components/link-component";
import { fontSaira } from "@/fonts";
import { useActionsWorkspaces } from "@/hooks/use-workspace";
import { IWorkspace } from "@/interfaces/IWorkspace";
import { useParams } from "next/navigation";
import React, { ReactNode } from "react";
import {
  IoAdd,
  IoAddCircle,
  IoGridOutline,
  IoDocumentsOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

// HOOK (mantido como no original, sem alterações na lógica)
const useFiles = () => {
  const { createFolder, createFile } = useActionsWorkspaces();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  const createFolderHandle = async () => {
    if (!id) return;
    await toast.promise(createFolder(id), {
      pending: "Criando espaço...",
      error: "Erro ao criar espaço!",
      success: "Espaço criado!",
    });
  };

  const createCardHandle = async () => {
    if (!id) return;
    await toast.promise(createFile(id), {
      pending: "Criando arquivo...",
      error: "Erro ao criar arquivo!",
      success: "Arquivo criado!",
    });
  };

  return { createFolderHandle, createCardHandle };
};

// --- NOVOS COMPONENTES DE UI ---

type WorkspaceHeaderProps = {
  title: string;
  onNewFolder: () => void;
  onNewFile: () => void;
};

function WorkspaceHeader(props: WorkspaceHeaderProps) {
  const { title, onNewFolder, onNewFile } = props;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-8">
      <h1
        className={`${fontSaira} text-3xl font-bold text-zinc-800 dark:text-zinc-100`}
      >
        {title}
      </h1>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <IoAdd /> Novo Espaço
        </button>
        <button
          onClick={onNewFile}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
        >
          <IoAdd /> Novo Arquivo
        </button>
      </div>
    </header>
  );
}

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  buttonText: string;
  onAction: () => void;
};

function EmptyState({ icon, title, buttonText, onAction }: EmptyStateProps) {
  return (
    <div className="w-full flex justify-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 border-dashed">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-indigo-500">{icon}</div>
        <span
          className={`${fontSaira} font-semibold text-zinc-600 dark:text-zinc-300 text-lg`}
        >
          {title}
        </span>
        <button
          onClick={onAction}
          className="flex items-center justify-center p-2 px-6 font-semibold rounded-lg bg-indigo-500 transition-all text-md hover:bg-indigo-600 text-indigo-50"
        >
          <span className={fontSaira}>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}

type ContentSectionProps = {
  title: string;
  icon: ReactNode;
  itemCount: number;
  limit: number;
  children: ReactNode;
  gridClass: string;
};

function ContentSection({
  title,
  icon,
  itemCount,
  limit,
  children,
  gridClass,
}: ContentSectionProps) {
  return (
    <section className="w-full mb-12">
      <header className="flex justify-between items-center w-full pb-3 border-b border-zinc-200 dark:border-zinc-700 mb-6">
        <div className="flex gap-3 items-center text-zinc-500 dark:text-zinc-400 font-semibold">
          {icon}
          <span className={`${fontSaira} text-lg`}>{title}</span>
        </div>
        <div className="p-1 px-3 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700">
          <span
            className={`${fontSaira} text-sm text-zinc-600 dark:text-zinc-300`}
          >
            {itemCount} / {limit}
          </span>
        </div>
      </header>
      <div className={gridClass}>{children}</div>
    </section>
  );
}

type FilesProps = {
  workspace: IWorkspace;
};

export function Files({ workspace }: FilesProps) {
  const { createFolderHandle, createCardHandle } = useFiles();
  const workspaces = workspace?.workspaces || [];
  const cards = workspace?.cards || [];

  return (
    <div className="w-full max-w-main mx-auto">
      <WorkspaceHeader
        title={workspace.name}
        onNewFolder={createFolderHandle}
        onNewFile={createCardHandle}
      />

      <ContentSection
        title="Espaços"
        icon={<IoGridOutline size={20} />}
        itemCount={workspaces.length}
        limit={20}
        gridClass="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4"
      >
        {workspaces.length > 0 ? (
          <>
            {workspaces.map((ws) => (
              <LinkComponent
                key={ws.id}
                name={ws.name}
                background={ws.background}
                href={`/workspaces/${ws.id}`}
              />
            ))}
            <button
              type="button"
              onClick={createFolderHandle}
              className="w-32 h-32 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
            >
              <IoAddCircle size={40} className="text-zinc-400" />
            </button>
          </>
        ) : (
          <EmptyState
            icon={<IoGridOutline size={50} />}
            title="Crie seu primeiro espaço!"
            buttonText="Criar Espaço"
            onAction={createFolderHandle}
          />
        )}
      </ContentSection>

      <ContentSection
        title="Arquivos"
        icon={<IoDocumentsOutline size={20} />}
        itemCount={cards.length}
        limit={50} // Exemplo de limite diferente
        gridClass="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4"
      >
        {cards.length > 0 ? (
          <>
            {cards.map((card) => (
              <LinkComponent
                key={card.id}
                name={card.title}
                createdAt={card.createdAt}
                type="file"
                background={card.background}
                href={`/card/${card.id}`}
              />
            ))}
            <button
              onClick={createCardHandle}
              type="button"
              className="h-40 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
            >
              <IoAddCircle size={40} className="text-zinc-400" />
            </button>
          </>
        ) : (
          <EmptyState
            icon={<IoDocumentsOutline size={50} />}
            title="Que tal um documento?"
            buttonText="Novo Arquivo"
            onAction={createCardHandle}
          />
        )}
      </ContentSection>
    </div>
  );
}
