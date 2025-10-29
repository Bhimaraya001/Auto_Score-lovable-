import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Star, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvaluationHistory {
  id: string;
  studentName: string;
  subject: string;
  marks: number;
  maxMarks: number;
  date: string;
}

interface HistorySidebarProps {
  history: EvaluationHistory[];
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (item: EvaluationHistory) => void;
}

const HistorySidebar = ({ history, isOpen, onClose, onSelectHistory }: HistorySidebarProps) => {
  return (
    <div
      className={`fixed lg:relative inset-y-0 right-0 z-40 w-80 bg-card border-l border-border shadow-xl transform transition-transform duration-300 lg:transform-none ${
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="gradient-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h2 className="font-semibold">Evaluation History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No evaluations yet</p>
              </div>
            ) : (
              history.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 cursor-pointer hover:shadow-hover transition-smooth hover:scale-105 border-l-4 border-l-primary"
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{item.studentName}</h3>
                      <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-accent fill-accent" />
                          <span className="text-xs font-semibold">
                            {item.marks}/{item.maxMarks}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HistorySidebar;
