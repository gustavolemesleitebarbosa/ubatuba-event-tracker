import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Event from "../types/Event";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { ThreeCircles } from "react-loader-spinner";
import { CategoryColors, CategoryTranslations, EventCategory } from "@/constants/categories";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}events/${id}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar o evento");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <img
          src="/images/logo_header.png"
          alt="logo"
          className="w-1/3 md:w-1/6 mx-auto mb-4 "
        />
        <h1 className="text-yellow-50 text-2xl font-bold mb-6">
          Carregando evento...
        </h1>
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#06f3bc"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold">Erro: {error}</h1>
      </div>
    );
  if (!event)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold">
          Evento não encontrado
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen w-full  p-6 md:p-12">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="mb-6 text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para os eventos
      </Button>

      <Card className="max-w-4xl pt-0 mx-auto bg-slate-300">
        <div className="w-full">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 md:h-96 object-cover rounded-t-lg"
            />
          ) : (
            <img
              src="/images/placeholder.png"
              alt="Event placeholder"
              className="w-full h-48 md:h-96 object-cover rounded-t-lg"
            />
          )}
          <div className="bg-black w-full h-[1.5px]"></div>
        </div>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <CardTitle className="w-[60%] md:w-[80%] break-words text-xl md:text-4xl font-bold">
              {event.title}
            </CardTitle>
            {event.category && (
              <span
                className={`px-4 py-1.5 text-sm md:text-lg rounded-full text-white ${
                  CategoryColors[event.category as EventCategory]
                }`}
              >
                {CategoryTranslations[event.category as EventCategory]}
              </span>
            )}
          </div>
          <div>
            <p className="text-lg break-words font-semibold text-gray-700">
              {new Date(event.date).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2"> Local</h2>
            <p className="text-gray-700 break-words flex items-center gap-1 text-md"> <MapPin className="w-4 h-4" />{event.location}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-gray-700 break-words">{event.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventDetail;
