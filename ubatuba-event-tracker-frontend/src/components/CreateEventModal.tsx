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
import { LogIn, Plus, Upload } from "lucide-react";
import Event from "@/types/Event";
import { useState, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CreateEventModalProps {
  onCreate: (newEvent: Omit<Event, "id">) => void;
  creating?: boolean;
}

export function CreateEventModal({
  onCreate,
  creating = false,
}: CreateEventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    location: "",
    date: new Date().toISOString().slice(0, 16),
    image: "",
    category: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: new Date().toISOString().slice(0, 16),
      image: "",
      category: null,
    });
    setSelectedImage(null);
    setPreviewUrl("");
    setErrors({});
  };

  const validateForm = () => {
    try {
      createEventSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreate(formData);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: new Date().toISOString().slice(0, 16),
        image: "",
        category: null,
      });
      resetForm();
    }
  };

  const isFormFilled = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.description.length <= 500 &&
      formData.location.trim() !== "" &&
      formData.date.trim() !== ""
    );
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>
        <Button
          className={` z-20  bg-slate-300 rounded-full ${
            isAuthenticated ? "fixed bottom-4 bg-blue-700 text-white right-4" : "fixed top-4 right-4"
          } `}
          variant="outline"
          size="lg"
          data-testid="open-button"
          disabled={creating}
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/login");
            }
          }}
        >
          {creating ? (
            <>
              <ColorRing
                visible={true}
                height="50"
                width="50"
                ariaLabel="color-ring-loading"
                colors={["#0ff22d", "#0ff22d", "#0ff22d", "#849b87", "#849b87"]}
              />
              <p>Criando...</p>
            </>
          ) : (
            <>
              {isAuthenticated && (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar evento
                </>
              )}
              {!isAuthenticated && (
                <>
                  Entrar
                  <LogIn className="mr-2 h-4 w-4" />
                </>
              )}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Criar novo evento"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              data-testid="title-input"
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
            <div className="relative">
              <Input
                id="description"
                data-testid="description-input"
                value={formData.description}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFormData({ ...formData, description: newValue });
                }}
                className={errors.description ? "border-red-500" : ""}
              />
              <div className={`absolute right-2 -bottom-6 text-xs ${
                formData.description.length > 500 ? "text-red-500" : "text-gray-500"
              }`}>
                {formData.description.length}/500
              </div>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-6">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              data-testid="location-input"
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
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              data-testid="date-input"
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
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
            <Label htmlFor="image">Imagem do evento</Label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {selectedImage ? "Change Image" : "Upload Image"}
            </Button>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              data-testid="create-event-button"
              variant="outline"
              className="bg-green-200"
              disabled={!isFormFilled()}
              onClick={handleCreate}
            >
              Criar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
