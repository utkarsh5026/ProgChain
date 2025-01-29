import * as XLSX from "xlsx";
import { Question } from "../../store/quiz/type";
import jsPDF from "jspdf";

/**
 * Downloads quiz questions as an Excel (XLSX) file.
 *
 * @param {Question[]} questions - An array of Question objects to be exported.
 */
export const downloadAsXLSX = (questions: Question[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    questions.map((q) => ({
      Question: q.text,
      ...q.answers.reduce(
        (acc, answer, index) => ({
          ...acc,
          [`Option ${index + 1}`]: answer,
        }),
        {}
      ),
      "Correct Answer(s)": q.correctAnswers
        .map((i) => `Option ${i + 1}`)
        .join(", "),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Questions");

  XLSX.writeFile(workbook, "quiz_questions.xlsx");
};

/**
 * Downloads quiz questions as a JSON file.
 *
 * @param {Question[]} questions - An array of Question objects to be exported.
 */
export const downloadAsJSON = (questions: Question[]) => {
  const jsonData = JSON.stringify(questions, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "quiz_questions.json";
  document.body.appendChild(a);
  a.click();
};

/**
 * Downloads quiz questions as a PDF file.
 *
 * @param {Question[]} questions - An array of Question objects to be exported.
 */
export const downloadAsPdf = (questions: Question[]) => {
  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(20);
  doc.text("Quiz Questions", 20, yPos);
  yPos += 15;

  questions.forEach((question: Question, index: number) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${question.text}`, 20, yPos);
    yPos += 10;

    question.answers.forEach((answer: string, answerIndex: number) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      if (question.correctAnswers.includes(answerIndex)) {
        doc.setTextColor(0, 128, 0); // Green color for correct answers
        doc.setFillColor(200, 250, 200); // Light green background
        doc.rect(20, yPos - 5, 170, 8, "F");
      } else {
        doc.setTextColor(0, 0, 0);
      }

      doc.text(
        `   ${String.fromCharCode(97 + answerIndex)}) ${answer}`,
        20,
        yPos
      );
      yPos += 8;
    });

    yPos += 10; // Add some space after each question
  });

  doc.save("quiz_questions.pdf");
};
