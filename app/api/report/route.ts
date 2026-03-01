import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  const { message, stack, metadata } = await req.json();
  const fingerprint = btoa(message.slice(0, 50)); // Hata parmak izi

  // AI'dan çözüm iste
  const prompt = `Hata: ${message}\nStack: ${stack}\nBu hatayı Türkçe analiz et ve kısa bir çözüm öner.`;
  const result = await model.generateContent(prompt);
  const aiSuggestion = result.response.text();

  // Supabase'e kaydet
  const { data: newGroup } = await supabase
    .from('error_groups')
    .insert([{ fingerprint, message, ai_suggestion: aiSuggestion }])
    .select().single();

  return NextResponse.json({ success: true });
}