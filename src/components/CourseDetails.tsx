import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface CourseDetailsProps {
  formData: {
    subject: string;
    maxMarks: string;
    teacherName: string;
    courseId: string;
  };
  onChange: (field: string, value: string) => void;
}

const CourseDetails = ({ formData, onChange }: CourseDetailsProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-hover transition-smooth">
      <div className="flex items-center gap-3 mb-6">
        <div className="gradient-primary p-3 rounded-lg">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Course Information</h2>
          <p className="text-sm text-muted-foreground">Enter evaluation details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject Name
          </Label>
          <Input
            id="subject"
            placeholder="e.g., Computer Science"
            value={formData.subject}
            onChange={(e) => onChange("subject", e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxMarks" className="text-sm font-medium">
            Maximum Marks
          </Label>
          <Input
            id="maxMarks"
            type="number"
            placeholder="e.g., 100"
            value={formData.maxMarks}
            onChange={(e) => onChange("maxMarks", e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teacherName" className="text-sm font-medium">
            Teacher Name
          </Label>
          <Input
            id="teacherName"
            placeholder="e.g., Dr. Smith"
            value={formData.teacherName}
            onChange={(e) => onChange("teacherName", e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseId" className="text-sm font-medium">
            Course ID
          </Label>
          <Input
            id="courseId"
            placeholder="e.g., CS-101"
            value={formData.courseId}
            onChange={(e) => onChange("courseId", e.target.value)}
            className="transition-smooth focus:shadow-card"
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseDetails;
