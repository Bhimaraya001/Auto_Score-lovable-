import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HistorySidebar from "@/components/HistorySidebar";
import CourseDetails from "@/components/CourseDetails";
import UploadSections from "@/components/UploadSections";
import StudentResult from "@/components/StudentResult";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const TeacherDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<EvaluationHistory[]>([]);

  // Form state
  const [courseData, setCourseData] = useState({
    subject: "",
    maxMarks: "",
    teacherName: profile?.full_name || "",
    courseId: "",
  });

  const [studentAnswer, setStudentAnswer] = useState("");
  const [referenceAnswer, setReferenceAnswer] = useState("");
  const [review, setReview] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [marks, setMarks] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "teacher")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.full_name) {
      setCourseData((prev) => ({ ...prev, teacherName: profile.full_name }));
    }
  }, [profile]);

  const handleCourseDataChange = (field: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutoEvaluate = async () => {
    if (!referenceAnswer || !studentAnswer || !courseData.maxMarks) {
      toast({
        title: "Missing Information",
        description: "Please provide both reference and student answers, and set max marks",
        variant: "destructive",
      });
      return;
    }

    setEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-answer", {
        body: {
          referenceAnswer,
          studentAnswer,
          maxMarks: parseInt(courseData.maxMarks),
        },
      });

      if (error) throw error;

      // Update the form with AI-generated evaluation
      setMarks(Math.round(data.marks).toString());
      setReview(data.feedback);

      toast({
        title: "Auto-Evaluation Complete!",
        description: `Score: ${data.score.toFixed(2)} | Marks: ${Math.round(data.marks)}/${courseData.maxMarks}`,
      });
    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to evaluate answer",
        variant: "destructive",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveEvaluation = async () => {
    if (!courseData.subject || !courseData.maxMarks || !studentEmail || !marks) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including student email",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save evaluation with student_email - RLS will handle matching students by email
      const { error } = await supabase
        .from("evaluations")
        .insert({
          teacher_id: user!.id,
          student_id: user!.id, // Temporary placeholder, student_email is what matters
          student_name: studentEmail,
          student_email: studentEmail,
          subject: courseData.subject,
          course_id: courseData.courseId,
          marks: parseInt(marks),
          max_marks: parseInt(courseData.maxMarks),
          student_answer: studentAnswer,
          reference_answer: referenceAnswer,
          review: review,
        });

      if (error) throw error;

      // Add to local history for UI
      const newEvaluation: EvaluationHistory = {
        id: Date.now().toString(),
        studentName: studentEmail,
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
        description: `Evaluation for ${studentEmail} has been saved successfully`,
      });

      setStudentEmail("");
      setMarks("");
      setStudentAnswer("");
      setReferenceAnswer("");
      setReview("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save evaluation",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (item: EvaluationHistory) => {
    setCourseData({
      subject: item.subject,
      maxMarks: item.maxMarks.toString(),
      teacherName: item.teacherName,
      courseId: item.courseId,
    });
    setStudentEmail(item.studentName); // Using studentName as email for history
    setMarks(item.marks.toString());
    setStudentAnswer(item.studentAnswer);
    setReferenceAnswer(item.referenceAnswer);
    setReview(item.review);

    toast({
      title: "History Loaded",
      description: `Loaded evaluation for ${item.studentName}`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
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
        <Header 
          onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          onSignOut={handleSignOut}
          userName={profile?.full_name}
        />

        <div className="flex-1 flex">
          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
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
                onAutoEvaluate={handleAutoEvaluate}
                evaluating={evaluating}
              />

              <StudentResult
                studentName={studentEmail}
                marks={marks}
                onStudentNameChange={setStudentEmail}
                onMarksChange={setMarks}
                onSave={handleSaveEvaluation}
              />
            </div>
          </main>

          <HistorySidebar
            history={history}
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            onSelectHistory={handleSelectHistory}
          />
        </div>

        <Footer />
      </div>

      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
