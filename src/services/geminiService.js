// Gemini AI Service for Warung Pintar Chatbot
const GEMINI_API_KEY = 'AIzaSyAr89BSn17ZAx7h_YZ2fEUU_NZGbIScJaI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System prompt - STRICT: Only answer about Warung Pintar
const SYSTEM_PROMPT = `Kamu asisten Warung Pintar. PENTING:

1. TOLAK pertanyaan di luar Warung Pintar dengan: "Maaf, saya hanya bisa membantu seputar fitur Warung Pintar seperti transaksi, produk, laporan, dan profil."

2. Untuk pertanyaan tentang Warung Pintar, jawab SINGKAT tapi LENGKAP (2-3 kalimat).

FITUR WARUNG PINTAR:
- Menu Transaksi: Input penjualan manual atau upload file CSV/Excel
- Menu Produk: Tambah, edit, hapus produk dan kelola stok
- Menu Laporan: Lihat laporan penjualan harian/bulanan, export PDF
- Menu Profil: Edit nama usaha, kategori, alamat, ganti password
- Dashboard: Lihat omset hari ini dan grafik penjualan

CONTOH JAWABAN BENAR:
Q: Cara tambah produk?
A: Klik menu Produk di sidebar, lalu tekan tombol "Tambah Produk". Isi nama, harga, dan stok produk, kemudian simpan.

Q: Cara post di Instagram?
A: Maaf, saya hanya bisa membantu seputar fitur Warung Pintar seperti transaksi, produk, laporan, dan profil.

ATURAN:
- Tanpa markdown (**, #, -, dll)
- Bahasa Indonesia yang jelas
- Langsung ke intinya`;

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Get MIME type from file
export const getMimeType = (file) => {
  return file.type || 'application/octet-stream';
};

// Check if file type is supported
export const isSupportedFileType = (file) => {
  const supportedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  return supportedTypes.includes(file.type);
};

// Send message to Gemini AI
export const sendMessageToGemini = async (message, conversationHistory = [], file = null) => {
  try {
    const contents = [];

    // Add conversation history for context
    if (conversationHistory.length > 0) {
      // Only keep last 10 messages for context
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach((msg) => {
        contents.push({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    // Build the current message parts
    const currentParts = [];

    // Add system prompt context to the user message
    const contextualMessage = conversationHistory.length === 0
      ? `${SYSTEM_PROMPT}\n\nPertanyaan user: ${message}`
      : message;

    currentParts.push({ text: contextualMessage });

    // If there's a file, add it to the message
    if (file) {
      const base64Data = await fileToBase64(file);
      const mimeType = getMimeType(file);

      currentParts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });

      // Add context about the file
      currentParts[0].text = `${SYSTEM_PROMPT}\n\nUser mengirim file dengan nama: ${file.name}\nPesan user: ${message || 'Tolong analisis file ini'}`;
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 150,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }

    const data = await response.json();

    // Extract the response text
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let responseText = data.candidates[0].content.parts[0].text;
      
      // Clean up markdown formatting
      responseText = responseText
        .replace(/\*\*/g, '')           // Remove **bold**
        .replace(/\*/g, '')             // Remove *italic*
        .replace(/#{1,6}\s/g, '')       // Remove # headers
        .replace(/`/g, '')              // Remove `code`
        .replace(/^\d+\.\s/gm, '')      // Remove numbered lists
        .replace(/^[-•]\s/gm, '')       // Remove bullet points
        .replace(/\n{3,}/g, '\n\n')     // Remove excessive newlines
        .trim();
      
      // Truncate to 2-3 sentences (max 200 chars) for complete but concise answers
      const sentences = responseText.split(/(?<=[.!?])\s+/);
      if (sentences.length > 3) {
        responseText = sentences.slice(0, 3).join(' ');
      }
      
      if (responseText.length > 200) {
        responseText = responseText.substring(0, 197) + '...';
      }
      
      return responseText;
    }

    throw new Error('No response from AI');
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
};

// Analyze transaction file (CSV, Excel, or receipt image) and extract data
export const analyzeTransactionFile = async (file) => {
  const FILE_ANALYSIS_PROMPT = `Kamu adalah asisten untuk menganalisis file transaksi bisnis.

TUGAS:
1. Analisis file yang diberikan (bisa berupa CSV, Excel, atau foto struk/nota)
2. Ekstrak data transaksi yang ada (nama produk, jumlah, harga)
3. Kembalikan hasil dalam format JSON

PENTING:
- Jika file adalah CSV/Excel: Ekstrak kolom yang relevan (nama item, qty, harga)
- Jika file adalah foto struk: Baca teks dan ekstrak item yang terlihat
- Jawab SINGKAT, langsung ke data

FORMAT RESPON (harus valid JSON):
{
  "message": "Ditemukan X transaksi dari file",
  "transactions": [
    {"product": "Nama Produk", "qty": 1, "price": 10000},
    {"product": "Produk Lain", "qty": 2, "price": 5000}
  ]
}

Jika tidak bisa membaca file atau tidak ada data transaksi:
{
  "message": "Tidak dapat mengekstrak data transaksi dari file ini",
  "transactions": []
}`;

  try {
    const base64Data = await fileToBase64(file);
    const mimeType = getMimeType(file);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: FILE_ANALYSIS_PROMPT },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze file');
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse JSON from response
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || 'File berhasil dianalisis',
          transactions: parsed.transactions || [],
        };
      }
    } catch (parseError) {
      // If can't parse JSON, return the text message
      console.error('JSON parse error:', parseError);
    }

    return {
      message: responseText || 'File berhasil dianalisis, namun tidak ditemukan data transaksi.',
      transactions: [],
    };
  } catch (error) {
    console.error('File analysis error:', error);
    throw error;
  }
};

export default {
  sendMessageToGemini,
  fileToBase64,
  getMimeType,
  isSupportedFileType,
  analyzeTransactionFile,
};

