import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Event from "@/types/Event";
import { Trash2 } from "lucide-react";
import { ColorRing } from "react-loader-spinner";

interface DeleteEventModalProps {
  event: Event;
  onDelete: () => void;
  deleting?: boolean;
}

export function DeleteEventModal({
  event,
  onDelete,
  deleting = false,
}: DeleteEventModalProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button
          data-testid="delete-button"
          variant="outline"
          className="bg-slate-100 rounded-full"
          size="icon"
          disabled={deleting}
        >
          {deleting ? (
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="color-ring-loading"
              colors={["#0ff22d", "#0ff22d", "#0ff22d", "#0ff22d", "#849b87"]}
            />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-100 max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Deletar Evento</DialogTitle>
          <DialogDescription>
            Você tem certeza que gostaria de deletar "{event.title.length > 25 ? event.title.substring(0, 15) + '...' : event.title}"? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              data-testid="confirm-delete-button"
              variant="destructive"
              className="bg-red-500"
              onClick={handleDelete}
            >
              Deletar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
