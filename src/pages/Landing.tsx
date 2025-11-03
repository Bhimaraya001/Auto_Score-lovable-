import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserCircle, BookOpen } from "lucide-react";
import studentsWelcome from "@/assets/students-welcome.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${studentsWelcome})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay Pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/20 via-transparent to-background/80" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">AutoScore</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-12">
          <div className="max-w-4xl text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Welcome to Answer Script
                <span className="block gradient-text mt-2">Evaluation System</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your evaluation process with our intelligent answer script assessment platform
              </p>
            </div>

            {/* Login Options */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8">
              {/* Teacher Login */}
              <div className="glass-card p-8 space-y-4 hover-scale animate-scale-in">
                <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">Teacher Portal</h3>
                <p className="text-muted-foreground">
                  Evaluate student answers, provide feedback, and manage assessments
                </p>
                <Link to="/auth?role=teacher" className="block">
                  <Button size="lg" className="w-full">
                    Teacher Login
                  </Button>
                </Link>
              </div>

              {/* Student Login */}
              <div className="glass-card p-8 space-y-4 hover-scale animate-scale-in" style={{ animationDelay: "0.1s" }}>
                <div className="w-16 h-16 mx-auto gradient-secondary rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">Student Portal</h3>
                <p className="text-muted-foreground">
                  View your evaluations, track progress, and access feedback
                </p>
                <Link to="/auth?role=student" className="block">
                  <Button size="lg" variant="secondary" className="w-full">
                    Student Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-12 h-12 mx-auto gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="font-semibold text-card-foreground">Easy Evaluation</h4>
                <p className="text-sm text-muted-foreground">Streamlined answer script assessment</p>
              </div>
              
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="w-12 h-12 mx-auto gradient-secondary rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-card-foreground">Track Progress</h4>
                <p className="text-sm text-muted-foreground">Monitor student performance over time</p>
              </div>
              
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="w-12 h-12 mx-auto gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-semibold text-card-foreground">Detailed Feedback</h4>
                <p className="text-sm text-muted-foreground">Provide constructive review comments</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; 2025 AutoScore. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
