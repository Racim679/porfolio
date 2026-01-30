import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import AboutMe from '@/components/AboutMe';
import MonParcours from '@/components/MonParcours';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero 
          profileImage="/photo_racim.png"
          description="Si Smail Racim, Étudiant Ingénieur. Je ne fais pas que coder, je conçois des solutions. Fort d'une maîtrise technique concrète (IA/Automation), je souhaite désormais appliquer cette rigueur opérationnelle au domaine de l'Informatique et Ingénierie Mathématique."
        />
        <Projects />
        <AboutMe />
        <MonParcours />
        <Footer />
      </main>
    </div>
  );
}
