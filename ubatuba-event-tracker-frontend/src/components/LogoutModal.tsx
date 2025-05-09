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
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function LogoutModal() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-6 text-white" variant="ghost" size="icon">
          <LogOut className="h-4 w-4" />
          <p>Sair</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sair</DialogTitle>
          <DialogDescription>
            Tem certeza de que gostaria de sair ? Você terá que logar novamente para criar ou modificar eventos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="bg-red-500"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 