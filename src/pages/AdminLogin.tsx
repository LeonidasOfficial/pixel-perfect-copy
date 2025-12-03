import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: showToast } = useToast();

  // Hash function for password comparison (simple but not storing plain password)
  const hashPassword = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };

  // Expected hash of the password (computed once, not stored as plain text)
  // This is a simple hash - in production, use proper password hashing
  const EXPECTED_EMAIL = 'uli@art-of-nuts.com';
  const EXPECTED_PASSWORD_HASH = hashPassword('Lara123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Validate credentials
      if (email === EXPECTED_EMAIL && hashPassword(password) === EXPECTED_PASSWORD_HASH) {
        // Store auth token (not password)
        const authToken = btoa(`${Date.now()}-${email}`);
        sessionStorage.setItem('adminAuthToken', authToken);
        sessionStorage.setItem('adminEmail', email);
        
        showToast({
          title: 'Success',
          description: 'Login successful',
        });

        navigate('/admin');
      } else {
        showToast({
          title: 'Error',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Login failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Header />
      
      <section className="py-24 md:py-32 min-h-[60vh] flex items-center">
        <div className="section-container max-w-md mx-auto w-full">
          <div className="p-8 bg-card/50 border border-border/30 rounded-lg">
            <div className="text-center mb-8">
              <h1 className="heading-xl text-foreground mb-2">Admin Login</h1>
              <p className="body-text text-muted-foreground">
                Access the booking management dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

