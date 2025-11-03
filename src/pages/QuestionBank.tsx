import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import collegeCampus from "@/assets/college-campus.jpg";
import studentsStudying from "@/assets/students-studying.jpg";

interface Question {
  id: string;
  subject: string;
  question_text: string;
  marks: number;
  created_at: string;
}

const QuestionBank = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    subject: "",
    question_text: "",
    marks: "",
  });

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "teacher")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchQuestions();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions" as any)
        .select("*")
        .eq("teacher_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data as any || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!newQuestion.subject || !newQuestion.question_text || !newQuestion.marks) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("questions" as any)
        .insert({
          teacher_id: user!.id,
          subject: newQuestion.subject,
          question_text: newQuestion.question_text,
          marks: parseInt(newQuestion.marks),
        } as any);

      if (error) throw error;

      toast({
        title: "Question Saved!",
        description: "Question added to your question bank",
      });

      setNewQuestion({ subject: "", question_text: "", marks: "" });
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("questions" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Question Deleted",
        description: "Question removed from your bank",
      });

      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    }
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
        className="fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url(${collegeCampus})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div
        className="fixed inset-0 z-0 opacity-10 animate-pulse-glow"
        style={{
          backgroundImage: `url(${studentsStudying})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onToggleHistory={() => {}}
          onSignOut={handleSignOut}
          userName={profile?.full_name}
        />

        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/teacher/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Question Bank</h2>
              <p className="text-muted-foreground">Save and manage your question papers</p>
            </div>

            {/* Add New Question */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Question
                </CardTitle>
                <CardDescription>Create a new question for your question bank</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="Enter subject"
                      value={newQuestion.subject}
                      onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marks</Label>
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({ ...newQuestion, marks: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    placeholder="Enter your question here..."
                    value={newQuestion.question_text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                    rows={5}
                  />
                </div>
                <Button onClick={handleSaveQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Save Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Saved Questions</CardTitle>
                <CardDescription>Your question bank collection</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions saved yet</p>
                    <p className="text-sm">Add your first question above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <Card key={question.id} className="glass-card">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-primary">{question.subject}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{question.question_text}</p>
                              <p className="text-xs text-muted-foreground">
                                Added on {new Date(question.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default QuestionBank;
