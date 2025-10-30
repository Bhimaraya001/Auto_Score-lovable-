import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2, BookOpen, TrendingUp, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import patternBg from "@/assets/pattern-bg.png";

const StudentDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "student")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

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
                  <p className="text-3xl font-bold">0</p>
                  <CardDescription>No evaluations yet</CardDescription>
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
                  <p className="text-3xl font-bold">--</p>
                  <CardDescription>Complete assignments to see your average</CardDescription>
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
                  <p className="text-3xl font-bold">--</p>
                  <CardDescription>Your best performance</CardDescription>
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
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No evaluations found</p>
                  <p className="text-sm">Your evaluated assignments will appear here</p>
                </div>
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
