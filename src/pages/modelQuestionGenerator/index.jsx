import { useState } from "react";
import { AlertCircle, BookOpen, FileText } from "lucide-react";
import Button from "../../components/ui/button";
import Card from "antd/es/card/Card";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Header from "../../components/Header";

const baseUrl = import.meta.env.VITE_PYTHON_URL;

export default function QuestionPaperGenerator() {
  const [files, setFiles] = useState({ syllabus: null });
  const [fileNames, setFileNames] = useState({ syllabus: "" });
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState({ syllabus: "" });
  const [questionPaper, setQuestionPaper] = useState(null);

  const handleFileChange = (event, fileKey) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        setFiles((prev) => ({ ...prev, [fileKey]: file }));
        setFileNames((prev) => ({ ...prev, [fileKey]: file.name }));
        setMessage("");
      } else {
        setMessage("Please select PDF files only");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.syllabus) {
      setLoading(true);
      setMessage("");
      setExtractedText({ syllabus: "" });
      setQuestionPaper(null);

      try {
        const formData = new FormData();
        formData.append("syllabus_pdf", files.syllabus);

        const response = await fetch(`${baseUrl}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) {
          setExtractedText(data.extracted_text);
          setQuestionPaper(data.question_paper);
          setIsGenerated(true);
        }
      } catch (error) {
        setMessage(`Upload failed: ${error.message}`);
        console.error("Upload error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setMessage("Please select the file before submitting");
    }
  };

  const handleReset = () => {
    setFiles({ syllabus: null });
    setFileNames({ syllabus: "" });
    setMessage("");
    setExtractedText({ syllabus: "" });
    setQuestionPaper(null);
    document
      .querySelectorAll('input[type="file"]')
      .forEach((input) => (input.value = ""));
  };

  const downloadPDF = () => {
    if (questionPaper) {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 70;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(questionPaper.title, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 40;

      // Duration and Max Marks
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Duration: ${questionPaper.duration}`, margin, yPosition);
      doc.text(
        `Maximum Marks: ${questionPaper.max_marks}`,
        pageWidth - margin,
        yPosition,
        { align: "right" }
      );
      yPosition += 40;

      // Instructions
      doc.setFont("helvetica", "italic");
      doc.text(
        `Answer any 5 questions. Each question carries ${questionPaper.sections[0].marks_per_question} marks.`,
        margin,
        yPosition
      );
      yPosition += 40;

      // Questions
      questionPaper.sections[0].questions.forEach((question, index) => {
        if (yPosition + 60 > pageHeight) {
          doc.addPage();
          yPosition = 70;
        }

        // Extract question parts using regex
        const parts = question.match(/^(\d+\.\s*[^(]+)(.*)$/);

        if (!parts) return;

        // Main question
        const questionNumber = `${index + 1}.`; // Ensure correct numbering
        const mainQuestionText = parts[1].replace(/^\d+\./, "").trim(); // Remove original number
        const fullMainQuestion = `${questionNumber} ${mainQuestionText}`;

        const mainLines = doc.splitTextToSize(fullMainQuestion, contentWidth);
        doc.setFont("helvetica", "bold");
        doc.text(mainLines, margin, yPosition);
        yPosition += mainLines.length * 15 + 10;

        // Sub-parts
        if (parts[2]) {
          doc.setFont("helvetica", "normal");
          const subParts = parts[2].trim().split(/\(\w\)/);
          subParts.shift(); // Remove empty first element

          subParts.forEach((subPart, subIndex) => {
            const subPartText = `(${String.fromCharCode(
              97 + subIndex
            )}) ${subPart.trim()}`;
            const subPartLines = doc.splitTextToSize(
              subPartText,
              contentWidth - 20
            );

            if (yPosition + subPartLines.length * 15 > pageHeight) {
              doc.addPage();
              yPosition = 70;
            }

            doc.text(subPartLines, margin + 20, yPosition);
            yPosition += subPartLines.length * 15 + 5;
          });
        }

        yPosition += 20; // Space between questions
      });

      // Save PDF
      doc.save(`${questionPaper.title}.pdf`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#27272a] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-4">
          {!isGenerated && (
            <div className="w-full flex justify-center">
              <Card style={{ width: "600px" }}>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-center">
                    Question Paper Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Syllabus PDF</span>
                          </div>
                        </label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, "syllabus")}
                            disabled={loading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#020617] hover:file:bg-blue-100"
                          />
                          {fileNames.syllabus && (
                            <span className="text-sm text-[#020617]">
                              Selected: {fileNames.syllabus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {message && (
                      <div
                        className={`flex items-center gap-2 ${
                          message.includes("Error") ||
                          message.includes("failed")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{message}</span>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between gap-4">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#6d28d9] hover:bg-[#6d28d9]"
                    style={{ background: "#6d28d9" }}
                  >
                    {loading ? "Processing..." : "Generate Question Paper"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    variant="outline"
                    className="w-full bg-[#6d28d9]"
                    style={{ background: "#6d28d9" }}
                  >
                    Reset
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {questionPaper && isGenerated && (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">
                  Generated Question Paper
                </CardTitle>
                <div className="flex gap-4 ml-auto">
                  <Button
                    onClick={downloadPDF}
                    className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white"
                    style={{ background: "#6d28d9" }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsGenerated(false)}
                    className="bg-[#6d28d9] hover:bg-[#6d28d9]"
                    style={{ background: "#6d28d9" }}
                  >
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Title, Duration, and Maximum Marks */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">
                      {questionPaper.title}
                    </h2>
                    <p className="text-gray-600">
                      Duration: {questionPaper.duration}
                    </p>
                    <p className="text-gray-600">
                      Maximum Marks: {questionPaper.max_marks}
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Answer any 5 questions. Each question carries{" "}
                      {questionPaper.sections[0].marks_per_question} marks.
                    </p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {questionPaper.sections[0].questions.map(
                      (questionText, index) => {
                        // Remove the original question number and split into parts
                        const withoutNumber = questionText.replace(
                          /^\d+\.\s*/,
                          ""
                        );
                        const parts = withoutNumber.split(/(?=\([a-z]\))/);
                        const mainQuestion = parts[0].trim();
                        const subParts = parts.slice(1);

                        return (
                          <div key={index} className="space-y-2">
                            {/* Main Question */}
                            <div className="text-gray-800">
                              <span className="font-medium">{`${
                                index + 1
                              }.`}</span>{" "}
                              {mainQuestion}
                            </div>

                            {/* Sub-Parts */}
                            {subParts.length > 0 && (
                              <div className="pl-4 space-y-1">
                                {subParts.map((part, partIndex) => (
                                  <div
                                    key={partIndex}
                                    className="text-gray-800"
                                  >
                                    {part.trim()}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
