'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Settings, 
  MessageSquare, 
  Trash2, 
  Copy, 
  Check,
  MoreVertical,
  ChevronDown,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Paperclip,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Enhanced types with better structure
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  metadata?: {
    model?: string;
    tokens?: number;
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface UIState {
  darkMode: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  parsedContent?: string;
}

// Declare PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// Google Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyD1W5tjlpNRxp4eYQXSp5Sk1frH1tYUx4I';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const ChatbotUI: React.FC = () => {
  // Core state management
  const [currentSession, setCurrentSession] = useState<ChatSession>(() => ({
    id: 'default',
    title: 'New Conversation',
    messages: [{
      id: 'welcome',
      content: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
      status: 'sent'
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [uiState, setUIState] = useState<UIState>({
    darkMode: true,
    isFullscreen: false,
    showSettings: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isPdfJsLoaded, setIsPdfJsLoaded] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF.js CDN
  useEffect(() => {
    const loadPdfJs = () => {
      if (window.pdfjsLib) {
        setIsPdfJsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        // Set worker source after script loads
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        setIsPdfJsLoaded(true);
        console.log('PDF.js loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load PDF.js');
      };
      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Memoized computed values
  const messageCount = useMemo(() => currentSession.messages.length, [currentSession.messages]);
  const lastMessage = useMemo(() => 
    currentSession.messages[currentSession.messages.length - 1], 
    [currentSession.messages]
  );

  // Parse PDF content
  const parsePdfContent = useCallback(async (file: File): Promise<string> => {
    if (!isPdfJsLoaded || !window.pdfjsLib) {
      throw new Error('PDF.js is not loaded');
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      console.log(`PDF loaded with ${pdf.numPages} pages`);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `Page ${pageNum}:\n${pageText}\n\n`;
      }

      console.log('PDF Content Parsed:');
      console.log(fullText);
      
      return fullText;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isPdfJsLoaded]);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      console.log('Uploading file:', file.name);
      
      // Parse PDF content
      const parsedContent = await parsePdfContent(file);
      
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        parsedContent: parsedContent
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      console.log('File uploaded and parsed successfully:', uploadedFile);
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [parsePdfContent]);

  // Remove uploaded file
  const removeUploadedFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Convert messages to Gemini API format
  const formatMessagesForAPI = useCallback((messages: Message[], additionalContext?: string): any[] => {
    // Skip the welcome message and only include user/assistant conversation
    const conversationMessages = messages.filter(msg => msg.id !== 'welcome');
    
    const apiMessages = conversationMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // If there's additional context (from PDF), add it to the last user message
    if (additionalContext && apiMessages.length > 0) {
      const lastMessage = apiMessages[apiMessages.length - 1];
      if (lastMessage.role === 'user') {
        lastMessage.parts[0].text = `${lastMessage.parts[0].text}\n\n[Additional Context from uploaded PDF]:\n${additionalContext}`;
      }
    }

    return apiMessages;
  }, []);

  // Call Gemini API
  const callGeminiAPI = useCallback(async (messages: Message[], additionalContext?: string): Promise<string> => {
    try {
      const apiMessages = formatMessagesForAPI(messages, additionalContext);
      
      const requestBody = {
        contents: apiMessages
      };

      console.log('Calling Gemini API with:', requestBody);

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Extract the text from the response
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }, [formatMessagesForAPI]);

  // Handle message sending
  const handleSendMessage = useCallback(async () => {
    if ((!inputValue.trim() && uploadedFiles.length === 0) || isProcessing) return;

    // Combine all PDF content
    const pdfContext = uploadedFiles
      .map(file => file.parsedContent)
      .filter(Boolean)
      .join('\n\n');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue.trim() || 'Uploaded PDF file(s)',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    // Update session with user message
    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date(),
      title: prev.messages.length === 1 ? (inputValue || 'PDF Analysis').slice(0, 50) + '...' : prev.title
    }));

    const currentInput = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);

    // Clear uploaded files after sending
    setUploadedFiles([]);

    try {
      // Get current messages including the new user message
      const messagesForAPI = [...currentSession.messages, userMessage];
      
      // Call Gemini API with PDF content as additional context
      const responseText = await callGeminiAPI(messagesForAPI, pdfContext);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseText,
        sender: 'assistant',
        timestamp: new Date(),
        status: 'sent',
        metadata: {
          model: 'gemini-2.0-flash',
          tokens: Math.floor(responseText.length / 4) // Rough estimate
        }
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        updatedAt: new Date()
      }));

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: `I apologize, but I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        sender: 'assistant',
        timestamp: new Date(),
        status: 'error'
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        updatedAt: new Date()
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing, currentSession.messages, callGeminiAPI, uploadedFiles]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Copy message content
  const handleCopyMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  }, []);

  // Clear conversation
  const handleClearConversation = useCallback(() => {
    setCurrentSession(prev => ({
      ...prev,
      messages: [{
        id: 'welcome-new',
        content: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
        sender: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      }],
      title: 'New Conversation',
      updatedAt: new Date()
    }));
    setUploadedFiles([]);
  }, []);

  // Toggle UI states
  const toggleDarkMode = useCallback(() => {
    setUIState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setUIState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((date: Date): string => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  const themeClasses = uiState.darkMode 
    ? 'bg-gray-950 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={cn(
      "flex flex-col transition-all duration-300",
      uiState.isFullscreen ? "fixed inset-0 z-50" : "h-screen",
      themeClasses
    )}>
      {/* Header */}
      <header className={cn(
        "flex items-center justify-between px-4 py-3 border-b backdrop-blur-sm",
        uiState.darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={cn(
              "text-sm font-medium",
              uiState.darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
            )}>
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm truncate max-w-48">
              {currentSession.title}
            </h1>
            <p className={cn(
              "text-xs flex items-center space-x-2",
              uiState.darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                isProcessing ? "bg-yellow-500 animate-pulse" : "bg-green-500"
              )} />
              <span>{isProcessing ? 'Thinking...' : 'Gemini 2.0 Flash'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-8 w-8 p-0"
          >
            {uiState.darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            {uiState.isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleClearConversation}>
                <Trash2 size={16} className="mr-2" />
                Clear conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {currentSession.messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3 group",
                message.sender === 'user' && 'flex-row-reverse space-x-reverse'
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={cn(
                  "text-sm",
                  message.sender === 'user'
                    ? uiState.darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
                    : uiState.darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                )}>
                  {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </AvatarFallback>
              </Avatar>

              <div className={cn(
                "flex flex-col space-y-1 max-w-[80%] sm:max-w-[70%]",
                message.sender === 'user' && 'items-end'
              )}>
                <Card className={cn(
                  "p-4 shadow-sm transition-colors relative group/message",
                  message.sender === 'user'
                    ? uiState.darkMode 
                      ? "bg-blue-600 text-white border-blue-500" 
                      : "bg-blue-500 text-white border-blue-400"
                    : uiState.darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-200 text-gray-900",
                  message.status === 'error' && "border-red-500 bg-red-50 text-red-900"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Message actions */}
                  <div className={cn(
                    "absolute top-2 opacity-0 group-hover/message:opacity-100 transition-opacity",
                    message.sender === 'user' ? 'left-2' : 'right-2'
                  )}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-black/10"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                    >
                      {copiedMessageId === message.id ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </Button>
                  </div>
                </Card>

                <div className={cn(
                  "flex items-center space-x-2 text-xs px-2",
                  uiState.darkMode ? "text-gray-500" : "text-gray-500"
                )}>
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.metadata?.tokens && (
                    <>
                      <span>•</span>
                      <span>{message.metadata.tokens} tokens</span>
                    </>
                  )}
                  {message.metadata?.model && (
                    <>
                      <span>•</span>
                      <span>{message.metadata.model}</span>
                    </>
                  )}
                  {message.status === 'error' && (
                    <>
                      <span>•</span>
                      <span className="text-red-500">Error</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isProcessing && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(
                  "text-sm",
                  uiState.darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                )}>
                  <Bot size={14} />
                </AvatarFallback>
              </Avatar>
              <Card className={cn(
                "p-4 shadow-sm",
                uiState.darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
              )}>
                <div className="flex space-x-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full animate-bounce",
                        uiState.darkMode ? "bg-gray-400" : "bg-gray-600"
                      )}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className={cn(
        "border-t p-4 backdrop-blur-sm",
        uiState.darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"
      )}>
        <div className="max-w-3xl mx-auto">
          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="mb-3 space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border",
                    uiState.darkMode 
                      ? "bg-gray-800 border-gray-700 text-gray-100" 
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  )}
                >
                  <FileText size={16} className="text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className={cn(
                      "text-xs",
                      uiState.darkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      {formatFileSize(file.size)} • PDF
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    onClick={() => removeUploadedFile(file.id)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isProcessing}
                className={cn(
                  "pr-12 resize-none transition-all",
                  uiState.darkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {inputValue.length}/2000
              </div>
            </div>
            
            {/* File Upload Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || !isPdfJsLoaded}
              className={cn(
                "shrink-0 transition-all",
                uiState.darkMode
                  ? "border-gray-700 hover:bg-gray-800"
                  : "border-gray-300 hover:bg-gray-50"
              )}
            >
              <Paperclip size={16} />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isProcessing}
              className={cn(
                "shrink-0 transition-all",
                (!inputValue.trim() && uploadedFiles.length === 0) || isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              )}
            >
              <Send size={16} />
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className={cn(
            "flex items-center justify-between mt-3 text-xs",
            uiState.darkMode ? "text-gray-500" : "text-gray-600"
          )}>
            <span>
              {messageCount} messages • Powered by Google Gemini 2.0 Flash
              {uploadedFiles.length > 0 && ` • ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} uploaded`}
            </span>
            <span>Press Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatbotUI;