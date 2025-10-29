import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadSectionsProps {
  studentAnswer: string;
  referenceAnswer: string;
  review: string;
  onStudentAnswerChange: (value: string) => void;
  onReferenceAnswerChange: (value: string) => void;
  onReviewChange: (value: string) => void;
}

const UploadSections = ({
  studentAnswer,
  referenceAnswer,
  review,
  onStudentAnswerChange,
  onReferenceAnswerChange,
  onReviewChange,
}: UploadSectionsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Answer Upload */}
      <Card className="p-6 shadow-card hover:shadow-hover transition-smooth group">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-smooth">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Student Answer</h3>
            <p className="text-xs text-muted-foreground">Upload or paste answer</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-smooth"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="studentAnswer" className="text-xs">Or paste text</Label>
            <Textarea
              id="studentAnswer"
              placeholder="Paste student's answer here..."
              value={studentAnswer}
              onChange={(e) => onStudentAnswerChange(e.target.value)}
              className="min-h-[150px] transition-smooth focus:shadow-card"
            />
          </div>
        </div>
      </Card>

      {/* Reference Answer */}
      <Card className="p-6 shadow-card hover:shadow-hover transition-smooth group">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-secondary/10 p-3 rounded-lg group-hover:scale-110 transition-smooth">
            <FileText className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold">Reference Answer</h3>
            <p className="text-xs text-muted-foreground">Model answer script</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-dashed border-2 hover:border-secondary hover:bg-secondary/5 transition-smooth"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="referenceAnswer" className="text-xs">Or paste text</Label>
            <Textarea
              id="referenceAnswer"
              placeholder="Paste reference answer here..."
              value={referenceAnswer}
              onChange={(e) => onReferenceAnswerChange(e.target.value)}
              className="min-h-[150px] transition-smooth focus:shadow-card"
            />
          </div>
        </div>
      </Card>

      {/* Review for Improvement */}
      <Card className="p-6 shadow-card hover:shadow-hover transition-smooth group">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent/10 p-3 rounded-lg group-hover:scale-110 transition-smooth">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Review & Feedback</h3>
            <p className="text-xs text-muted-foreground">Improvement notes</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="review" className="text-xs">Add feedback</Label>
          <Textarea
            id="review"
            placeholder="Enter detailed feedback and suggestions for improvement..."
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            className="min-h-[218px] transition-smooth focus:shadow-card"
          />
        </div>
      </Card>
    </div>
  );
};

export default UploadSections;
