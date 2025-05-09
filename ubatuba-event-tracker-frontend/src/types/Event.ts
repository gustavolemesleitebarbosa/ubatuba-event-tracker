
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category?: string | null | undefined;
  image?: string;
}

export default Event;