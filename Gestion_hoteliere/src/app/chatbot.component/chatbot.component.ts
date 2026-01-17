import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  providers: [DatePipe]
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  isOpen = false;
  userMessage = '';
  isLoading = false;
  
  messages: Message[] = [
    {
      text: "Hello! I'm Roy, your AI concierge at Royellas Hotel. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ];
  
  // Réponses prédéfinies
  predefinedResponses: { [key: string]: string } = {
    'hello': 'Hello! Welcome to Royellas Hotel. How may I assist you today?',
    'hi': 'Hi there! I\'m Roy, your virtual concierge. What can I help you with?',
    'booking': 'For bookings, you can use our online booking system or call +1 (310) 555-1234. Would you like me to direct you to the booking page?',
    'reservation': 'To make a reservation, visit our booking page or contact our reservations team at +1 (310) 555-1234.',
    'check in': 'Check-in time is 3:00 PM. Early check-in may be available upon request, subject to availability.',
    'check out': 'Check-out time is 11:00 AM. Late check-out can be arranged for an additional fee, based on availability.',
    'amenities': 'We offer luxury amenities including infinity pool, spa, fine dining, fitness center, and 24/7 concierge service.',
    'pool': 'Our infinity pool is open from 7 AM to 10 PM daily. It features panoramic ocean views and private cabanas.',
    'spa': 'The spa is open from 9 AM to 9 PM. We offer massage therapies, steam rooms, and wellness treatments.',
    'restaurant': 'We have three restaurants: The Golden Terrace (fine dining), Ocean Breeze (seafood), and The Lounge (casual).',
    'wifi': 'Complimentary high-speed WiFi is available throughout the hotel.',
    'parking': 'Valet parking is available for $45 per night. Self-parking is also available.',
    'pet': 'We are pet-friendly! A $150 pet fee applies per stay. Please inform us in advance.',
    'contact': 'You can reach us at +1 (310) 555-1234 or email reservations@royellashotel.com.',
    'location': 'We are located at 123 Luxury Avenue, Beverly Hills, CA 90210.',
    'thanks': 'You\'re welcome! Is there anything else I can help you with?',
    'thank you': 'My pleasure! Feel free to ask if you need anything else.',
    'bye': 'Goodbye! Have a wonderful stay at Royellas Hotel!',
    'goodbye': 'Thank you for chatting! We look forward to welcoming you soon.'
  };
  
  // Suggestions de questions
  quickQuestions = [
    'Make a booking',
    'Check amenities',
    'Restaurant hours',
    'Spa services',
    'Contact information'
  ];

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object  // <-- Ajouté ici
  ) {}

  ngOnInit(): void {
    // CORRECTION : Utiliser isPlatformBrowser pour vérifier si on est côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
          this.messages = JSON.parse(savedMessages);
        }
      } catch (error) {
        console.warn('Impossible de charger l\'historique du chat:', error);
        // Garder le message par défaut
        this.messages = [{
          text: "Hello! I'm Roy, your AI concierge at Royellas Hotel. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date()
        }];
      }
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    
    const userMsg: Message = {
      text: this.userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(userMsg);
    
    this.saveChatHistory();
    
    const messageText = this.userMessage;
    this.userMessage = '';
    
    this.scrollToBottom();
    
    // Auto-resize textarea
    this.autoResize();
    
    this.isLoading = true;
    
    setTimeout(() => {
      const botResponse = this.generateResponse(messageText.toLowerCase());
      const botMsg: Message = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.push(botMsg);
      this.isLoading = false;
      this.saveChatHistory();
      this.scrollToBottom();
    }, 1000);
  }

  private generateResponse(userMessage: string): string {
    for (const [keyword, response] of Object.entries(this.predefinedResponses)) {
      if (userMessage.includes(keyword)) {
        return response;
      }
    }
    
    if (userMessage.includes('room') || userMessage.includes('suite')) {
      return 'We offer Deluxe Rooms from $499/night, Executive Suites from $799/night, and Presidential Suites from $1,499/night. All rooms feature luxury amenities and stunning views.';
    }
    
    if (userMessage.includes('price') || userMessage.includes('cost')) {
      return 'Room rates vary by season and room type. For current pricing and special offers, please visit our booking page or contact our reservations team.';
    }
    
    if (userMessage.includes('breakfast')) {
      return 'Breakfast is served daily from 6:30 AM to 11:00 AM in The Golden Terrace restaurant. Room service breakfast is also available 24/7.';
    }
    
    if (userMessage.includes('business') || userMessage.includes('meeting')) {
      return 'We have state-of-the-art business facilities including meeting rooms, conference halls, and a business center. Please contact our events team for details.';
    }
    
    if (userMessage.includes('transport') || userMessage.includes('airport')) {
      return 'We offer airport transportation services. Please provide your flight details at least 24 hours in advance for arrangements.';
    }
    
    const defaultResponses = [
      "I'd be happy to help with that. Could you please provide more details?",
      "For specific inquiries, I recommend contacting our concierge desk at extension 0 from your room phone.",
      "I'm here to assist with general questions. For immediate assistance, please call +1 (310) 555-1234.",
      "That's a great question! Let me connect you with the appropriate department. In the meantime, is there anything else I can help with?",
      "I understand you're asking about that. Our team would be happy to provide detailed information. Shall I direct your question to them?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  selectQuickQuestion(question: string): void {
    this.userMessage = question;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = 
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  autoResize(): void {
    if (this.messageInput) {
      const textarea = this.messageInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight) + 'px';
    }
  }

  private saveChatHistory(): void {
    // CORRECTION : Vérifier si on est côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      try {
        const recentMessages = this.messages.slice(-50);
        localStorage.setItem('chatHistory', JSON.stringify(recentMessages));
      } catch (error) {
        console.warn('Impossible de sauvegarder l\'historique du chat:', error);
      }
    }
  }

  clearChat(): void {
    this.messages = [{
      text: "Hello! I'm Roy, your AI concierge at Royellas Hotel. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }];
    
    // CORRECTION : Vérifier si on est côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem('chatHistory');
      } catch (error) {
        console.warn('Impossible de supprimer l\'historique du chat:', error);
      }
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
    this.autoResize();
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'shortTime') || '';
  }
}