import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] =
    useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if (content === "") {
      return;
    }
    onNoteCreated(content);
    setContent("");
    setShouldShowOnboarding(true);
    toast.success("Note created successfully.");
  }

  function handleStartRecording() {
    // Check if the SpeechRecognition API is available in the browser
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition";

    // Display an error toast if the SpeechRecognition API is not available
    if (!isSpeechRecognitionAPIAvailable) {
      toast.error("Browser does not support recording.");
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    // Get the appropriate SpeechRecognition API based on browser
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // Create a new instance of SpeechRecognition
    speechRecognition = new SpeechRecognitionAPI();

    // Set SpeechRecognition properties
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition?.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left overflow-hidden hover:ring-2 hover:ring-slate-600 outline-none relative focus-visible:ring-2 focus-visible:ring-lime-400   ">
        <span className="text-sm font-medium text-slate-200">Add note</span>
        <p className="text-sm leading-6 text-slate-300">
          Start by recoring or typing a note
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="overflow-hidden inset-0 fixed md:left-1/2 md:top-1/2 md:h-[60vh] md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Add note
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-300">
                  Start by{" "}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    recording
                  </button>{" "}
                  or{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    typing
                  </button>{" "}
                  a note.
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Recording (click to stop)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handleSaveNote}
              >
                Save note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
