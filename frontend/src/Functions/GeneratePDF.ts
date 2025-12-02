import {jsPDF} from "jspdf"
import 'jspdf-autotable';
import autoTable, { RowInput } from "jspdf-autotable";
import {FormData} from "../Components/Form"
import { ScoreType } from "../Pages/Score";
import  header from "/assets/images/header.jpg"
import  logo from "/assets/images/mcalogo.png"

const loadImageWithOpacity = (url: string, opacity: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not available");

      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

const addWatermark = async (doc: jsPDF, logoUrl: string) => {
  const logoBase64 = await loadImageWithOpacity(logoUrl, 0.8); // 20% opacity
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.addImage(logoBase64, "PNG", 40, 100, 120, 60, "", "FAST");
  }
};

export const GenerateparticipantsList = (data: FormData[]) => {
  const doc = new jsPDF({ format: "A4" });
  const pageWidth: number = doc.internal.pageSize.getWidth();

  doc.addImage(header, "PNG", 15, 0, 180, 40);
  // 🔹 Title styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DEPARTMENT OF COMPUTER APPLICATIONS", pageWidth / 2, 44, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204); // blue sub-heading
  doc.text("HACKATHON 2K25 - PARTICIPANTS LIST", pageWidth / 2, 54, {
    align: "center",
  });

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, 35, pageWidth - 15, 35); // underline for style

  const formattedData: RowInput[] = [];

  data.forEach((d, index) => {
    let s: string[] = [];
    s.push((index + 1).toString());
    s.push(d.lotNo.toString());
    s.push(""); // for signature space
    formattedData.push(s);
  });

  autoTable(doc, {
    head: [["S. No", "Roll No", "Name", "Class", "Email", "Sign"]],
    body: formattedData,
    startY: 65, // pushed up closer to heading
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34], // darker green header
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 11,
    },
    bodyStyles: {
      valign: "middle",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },   // S. No
      1: { halign: "center", cellWidth: 28 },   // Roll No
      2: { cellWidth: 42 },                     // Name
      3: { halign: "center", cellWidth: 22 },   // Class
      4: { cellWidth: 40 },                     // Email (reduced ✅)
      5: { halign: "center", cellWidth: 46 },   // Sign (more space ✅)
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });
  addWatermark(doc,logo)
  doc.save("Hackathon_Name_List.pdf");
};

export const GenerateparticipantsScore = (data: ScoreType[]) => {
  const doc = new jsPDF({ format: "A4" });
  const pageWidth: number = doc.internal.pageSize.getWidth();
  doc.addImage(header, "PNG", 15, 0, 180, 40);
  // 🔹 Title styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DEPARTMENT OF COMPUTER APPLICATIONS", pageWidth / 2, 44, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204); // blue sub-heading
  doc.text("HACKATHON 2K25 - Score", pageWidth / 2, 54, {
    align: "center",
  });

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, 35, pageWidth - 15, 35); // underline for style

  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204); // blue sub-heading
  doc.text("Winners", pageWidth / 2, 74, {
    align: "left",
  });

  const winners: ScoreType[] = []
  winners.push(data.find((d)=> d.Position === "I")!)
  winners.push(data.find((d)=> d.Position === "II")!)
  winners.push(data.find((d)=> d.Position === "III")!)



  const formattedWinnerData: RowInput[] = [];

  winners.forEach((winner,index)=>{
    let temp:string[] = []
    temp.push((index+1).toString())
    temp.push(winner.Position)
    formattedWinnerData.push(temp)
  })  

    autoTable(doc, {
    head: [["S. No", "Roll No", "Name", "Class", "Email","Position"]],
    body: formattedWinnerData,
    startY: 80, // pushed up closer to heading
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34], // darker green header
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 11,
    },
    bodyStyles: {
      valign: "middle",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },   // S. No
      1: { halign: "center", cellWidth: 28 },   // Roll No
      2: { cellWidth: 42 },                     // Name
      3: { halign: "center", cellWidth: 22 },   // Class
      4: { cellWidth: 40 },                     // Email (reduced ✅)
      5: { halign: "center", cellWidth: 46 },   // Sign (more space ✅)
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });


  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204); // blue sub-heading
  doc.text("Participants", pageWidth / 2, 140, {
    align: "left",
  });

  const participants: ScoreType[] = []
  data.forEach((d)=>{
    if(!["I","II","III"].includes(d.Position))
    {
      participants.push(d)
    }
      
  })


  const formattedParticipantData: RowInput[] = [];

  participants.forEach((participant,index)=>{
    let temp:string[] = []
    temp.push((index+1).toString())
    temp.push(participant.Position)
    formattedParticipantData.push(temp)
  })  

    autoTable(doc, {
    head: [["S. No", "Roll No", "Name", "Class", "Email","Position"]],
    body: formattedParticipantData,
    startY: 145, // pushed up closer to heading
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34], // darker green header
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 11,
    },
    bodyStyles: {
      valign: "middle",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },   // S. No
      1: { halign: "center", cellWidth: 28 },   // Roll No
      2: { cellWidth: 42 },                     // Name
      3: { halign: "center", cellWidth: 22 },   // Class
      4: { cellWidth: 40 },                     // Email (reduced ✅)
      5: { halign: "center", cellWidth: 46 },   // Sign (more space ✅)
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save("HackathonScore.pdf");
};