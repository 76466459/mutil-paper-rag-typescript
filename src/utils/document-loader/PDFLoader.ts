import { DirectoryLoader } from '@langchain/classic/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

/**
 * Load PDF documents from a specified directory
 * @param dataPath Path to the directory containing PDF files
 * @returns Promise<Document[]> Array of loaded PDF documents
 */
export async function loadPDFs(dataPath: string): Promise<Document[]> {
  const directoryLoader = new DirectoryLoader(
    dataPath, 
    {
      '.pdf': (path: string) => new PDFLoader(path),
    },
    true, // recursive
    'warn' // unknown file type handling: 'ignore' | 'warn' | 'error'
  );

  const directoryDocs = await directoryLoader.load();
  console.log(`Loaded ${directoryDocs.length} PDF documents.`);

  return directoryDocs;
}

/**
 * Split documents into chunks using RecursiveCharacterTextSplitter
 * @param documents Array of documents to split
 * @param chunkSize Size of each text chunk (default: 1000)
 * @param chunkOverlap Overlap between chunks (default: 200)
 * @returns Promise<Document[]> Array of split documents
 */
export async function splitDocuments(
  documents: Document[],
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const splitDocs = await textSplitter.splitDocuments(documents);
  console.log(`Split documents into ${splitDocs.length} chunks.`);

  return splitDocs;
}
