import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2, BookOpen, TrendingUp, Award, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import patternBg from "@/assets/pattern-bg.png";

interface Evaluation {
  id: string;
  subject: string;
  marks: number;
  max_marks: number;
  review: string;
  created_at: string;
  student_answer: string;
  reference_answer: string;
}

const StudentDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "student")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("evaluations")
          .select("*")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvaluations(data || []);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      } finally {
        setLoadingEvaluations(false);
      }
    };

    if (user) {
      fetchEvaluations();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const totalEvaluations = evaluations.length;
  const averageScore = totalEvaluations > 0 
    ? (evaluations.reduce((sum, e) => sum + (e.marks / e.max_marks) * 100, 0) / totalEvaluations).toFixed(1)
    : "--";
  const highestScore = totalEvaluations > 0
    ? Math.max(...evaluations.map(e => (e.marks / e.max_marks) * 100)).toFixed(1)
    : "--";

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
        {/* Header */}
        <header className="glass-card sticky top-0 z-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold gradient-text">EvalScript</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name}
                </span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Student Dashboard</h2>
              <p className="text-muted-foreground">View your evaluations and track your progress</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Total Evaluations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalEvaluations}</p>
                  <CardDescription>
                    {totalEvaluations === 0 ? "No evaluations yet" : `${totalEvaluations} completed`}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{averageScore}%</p>
                  <CardDescription>
                    {totalEvaluations === 0 ? "Complete assignments to see your average" : "Your overall performance"}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Highest Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{highestScore}%</p>
                  <CardDescription>
                    {totalEvaluations === 0 ? "Your best performance" : "Your top score"}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Recent Evaluations */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Evaluations</CardTitle>
                <CardDescription>Your latest answer script assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEvaluations ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </div>
                ) : evaluations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No evaluations found</p>
                    <p className="text-sm">Your evaluated assignments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {evaluations.map((evaluation) => (
                      <Card key={evaluation.id} className="glass-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{evaluation.subject}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(evaluation.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold gradient-text">
                                {evaluation.marks}/{evaluation.max_marks}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {((evaluation.marks / evaluation.max_marks) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {evaluation.review && (
                          <CardContent>
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary" />
                              <div>
                                <p className="font-semibold text-sm mb-1">Teacher's Review:</p>
                                <p className="text-sm text-muted-foreground">{evaluation.review}</p>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2025 EvalScript. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;
