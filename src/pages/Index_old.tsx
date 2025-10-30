import { useState } from "react";
import Header from "@/components/Header";
import HistorySidebar from "@/components/HistorySidebar";
import CourseDetails from "@/components/CourseDetails";
import UploadSections from "@/components/UploadSections";
import StudentResult from "@/components/StudentResult";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";
import patternBg from "@/assets/pattern-bg.png";

interface EvaluationHistory {
  id: string;
  studentName: string;
  subject: string;
  marks: number;
  maxMarks: number;
  date: string;
  teacherName: string;
  courseId: string;
  studentAnswer: string;
  referenceAnswer: string;
  review: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<EvaluationHistory[]>([]);

  // Form state
  const [courseData, setCourseData] = useState({
    subject: "",
    maxMarks: "",
    teacherName: "",
    courseId: "",
  });

  const [studentAnswer, setStudentAnswer] = useState("");
  const [referenceAnswer, setReferenceAnswer] = useState("");
  const [review, setReview] = useState("");
  const [studentName, setStudentName] = useState("");
  const [marks, setMarks] = useState("");

  const handleCourseDataChange = (field: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEvaluation = () => {
    // Validation
    if (!courseData.subject || !courseData.maxMarks || !studentName || !marks) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEvaluation: EvaluationHistory = {
      id: Date.now().toString(),
      studentName,
      subject: courseData.subject,
      marks: parseInt(marks),
      maxMarks: parseInt(courseData.maxMarks),
      date: new Date().toLocaleDateString(),
      teacherName: courseData.teacherName,
      courseId: courseData.courseId,
      studentAnswer,
      referenceAnswer,
      review,
    };

    setHistory((prev) => [newEvaluation, ...prev]);

    toast({
      title: "Evaluation Saved!",
      description: `${studentName}'s evaluation has been added to history`,
    });

    // Clear form
    setStudentName("");
    setMarks("");
    setStudentAnswer("");
    setReferenceAnswer("");
    setReview("");
  };

  const handleSelectHistory = (item: EvaluationHistory) => {
    setCourseData({
      subject: item.subject,
      maxMarks: item.maxMarks.toString(),
      teacherName: item.teacherName,
      courseId: item.courseId,
    });
    setStudentName(item.studentName);
    setMarks(item.marks.toString());
    setStudentAnswer(item.studentAnswer);
    setReferenceAnswer(item.referenceAnswer);
    setReview(item.review);

    toast({
      title: "History Loaded",
      description: `Loaded evaluation for ${item.studentName}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "400px",
        }}
      />
      
      <div
        className="fixed inset-0 z-0 opacity-10 animate-pulse-glow"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} />

        <div className="flex-1 flex">
          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Floating decorative elements */}
            <div className="fixed top-20 right-10 w-20 h-20 gradient-primary rounded-full opacity-20 blur-2xl animate-float" />
            <div className="fixed bottom-20 left-10 w-32 h-32 gradient-secondary rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

            <div className="space-y-6 animate-fade-in">
              <CourseDetails formData={courseData} onChange={handleCourseDataChange} />
              
              <UploadSections
                studentAnswer={studentAnswer}
                referenceAnswer={referenceAnswer}
                review={review}
                onStudentAnswerChange={setStudentAnswer}
                onReferenceAnswerChange={setReferenceAnswer}
                onReviewChange={setReview}
              />

              <StudentResult
                studentName={studentName}
                marks={marks}
                onStudentNameChange={setStudentName}
                onMarksChange={setMarks}
                onSave={handleSaveEvaluation}
              />
            </div>
          </main>

          {/* History Sidebar */}
          <HistorySidebar
            history={history}
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            onSelectHistory={handleSelectHistory}
          />
        </div>

        <Footer />
      </div>

      {/* Overlay for mobile history */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
