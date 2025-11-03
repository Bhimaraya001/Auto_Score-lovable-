import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, FileText, BookOpen, ArrowLeft, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import collegeCampus from "@/assets/college-campus.jpg";
import studentsStudying from "@/assets/students-studying.jpg";

const SchemeGenerator = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [textbookContent, setTextbookContent] = useState("");
  const [questionPaper, setQuestionPaper] = useState("");
  const [generatedScheme, setGeneratedScheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractingTextbook, setExtractingTextbook] = useState(false);
  const [extractingQuestion, setExtractingQuestion] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "teacher")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  const handleGenerateScheme = async () => {
    if (!textbookContent || !questionPaper) {
      toast({
        title: "Missing Information",
        description: "Please provide both textbook content and question paper",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-scheme", {
        body: {
          textbookContent,
          questionPaper,
        },
      });

      if (error) throw error;

      setGeneratedScheme(data.scheme);
      toast({
        title: "Scheme Generated!",
        description: "Answer scheme has been created successfully",
      });
    } catch (error: any) {
      console.error("Error generating scheme:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate scheme",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleImageUpload = async (file: File, type: 'textbook' | 'question') => {
    const setLoading = type === 'textbook' ? setExtractingTextbook : setExtractingQuestion;
    const setContent = type === 'textbook' ? setTextbookContent : setQuestionPaper;

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        
        if (!base64String) {
          throw new Error("Failed to read image");
        }

        const { data, error } = await supabase.functions.invoke("extract-text", {
          body: { imageBase64: base64String },
        });

        if (error) throw error;

        setContent((prev) => prev + (prev ? '\n\n' : '') + data.text);
        toast({
          title: "Text Extracted!",
          description: "Successfully extracted text from image",
        });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("Error extracting text:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to extract text from image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <h2 className="text-3xl font-bold gradient-text mb-2">Scheme Generator</h2>
              <p className="text-muted-foreground">Generate answer schemes from textbook and question papers</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Textbook Upload */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Textbook Content
                  </CardTitle>
                  <CardDescription>Paste or upload textbook content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Textbook Text</Label>
                    <Textarea
                      placeholder="Paste textbook content here or upload image..."
                      value={textbookContent}
                      onChange={(e) => setTextbookContent(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Or Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'textbook');
                      }}
                      disabled={extractingTextbook}
                    />
                    {extractingTextbook && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Extracting text...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Question Paper Upload */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Question Paper
                  </CardTitle>
                  <CardDescription>Paste or upload question paper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Questions</Label>
                    <Textarea
                      placeholder="Paste question paper here or upload image..."
                      value={questionPaper}
                      onChange={(e) => setQuestionPaper(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Or Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'question');
                      }}
                      disabled={extractingQuestion}
                    />
                    {extractingQuestion && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Extracting text...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <Button 
                  onClick={handleGenerateScheme} 
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Scheme...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Generate Answer Scheme
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Scheme */}
            {generatedScheme && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Generated Answer Scheme
                  </CardTitle>
                  <CardDescription>Review and use this scheme for evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={generatedScheme}
                    onChange={(e) => setGeneratedScheme(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Save Scheme
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SchemeGenerator;
