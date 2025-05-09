import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import Event from "@/types/Event";
import { useState, useEffect } from "react";
import { createEventSchema } from "@/schemas/event.schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CategoryTranslations, EVENT_CATEGORIES } from "@/constants/categories";
import { ColorRing } from "react-loader-spinner";

interface EditEventModalProps {
  event: Event;
  onSave: (updatedEvent: Event) => void;
  updating?: boolean;
}

export function EditEventModal({
  event,
  onSave,
  updating = false,
}: EditEventModalProps) {
  const [formData, setFormData] = useState(event);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const resetForm = () => {
    setFormData(event);
    setErrors({});
    setIsValid(true);
  };

  useEffect(() => {
    try {
      createEventSchema.parse(formData);
      setIsValid(true);
      setErrors({});
    } catch (error) {
      setIsValid(false);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }, [formData]);

  const handleSave = () => {
    if (isValid) {
      onSave(formData);
    }
    resetForm();
  };

  const isFormFilled = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.date.trim() !== ""
    );
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button
          data-testid="edit-button"
          variant="outline"
          className="bg-slate-100 rounded-full"
          size="icon"
          disabled={updating}
        >
          {updating ? (
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="color-ring-loading"
              colors={['#0ff22d', '#0ff22d', '#0ff22d', '#0ff22d', '#849b87']}
            />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-100 max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              data-testid="edit-title-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              data-testid="edit-description-input"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              data-testid="edit-location-input"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <span>{formData.category ? CategoryTranslations[formData.category as keyof typeof CategoryTranslations] : "Selecione uma categoria"}</span>
                </SelectTrigger>                    
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem
                    className="bg-slate-100 border-slate-300 border-b-[1px]"
                    key={category}
                    value={category}
                  >
                    {CategoryTranslations[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              data-testid="edit-date-input"
              min={new Date().toISOString().slice(0, 16)}
              type="datetime-local"
              value={new Date(formData.date).toISOString().slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              data-testid="save-event-button"
              variant="outline"
              className="bg-green-200"
              disabled={!isFormFilled()}
              onClick={handleSave}
            >
              Salvar alterações
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
