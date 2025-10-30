import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Award, Save } from "lucide-react";

interface StudentResultProps {
  studentName: string;
  marks: string;
  onStudentNameChange: (value: string) => void;
  onMarksChange: (value: string) => void;
  onSave: () => void;
}

const StudentResult = ({
  studentName,
  marks,
  onStudentNameChange,
  onMarksChange,
  onSave,
}: StudentResultProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-hover transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="gradient-secondary p-3 rounded-lg">
          <Award className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Student Evaluation</h2>
          <p className="text-sm text-muted-foreground">Final marks and details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="studentName" className="text-sm font-medium">
            Student Email
          </Label>
          <Input
            id="studentName"
            type="email"
            placeholder="Enter student email"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marks" className="text-sm font-medium">
            Marks Obtained
          </Label>
          <Input
            id="marks"
            type="number"
            placeholder="Enter marks"
            value={marks}
            onChange={(e) => onMarksChange(e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>
      </div>

      <Button
        onClick={onSave}
        className="w-full gradient-primary text-primary-foreground hover:shadow-hover transition-smooth"
        size="lg"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Evaluation to History
      </Button>
    </Card>
  );
};

export default StudentResult;
