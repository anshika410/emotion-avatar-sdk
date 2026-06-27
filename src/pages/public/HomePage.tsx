import HeroSection from '../../components/home/HeroSection';
import SenseiSection from '../../components/home/SenseiSection';
import GuruSection from '../../components/home/GuruSection';
import HighlightsSection from '../../components/home/HighlightsSection';
import CoursesPreview from '../../components/home/CoursesPreview';
import GalleryPreview from '../../components/home/GalleryPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SenseiSection />
      <GuruSection />
      <HighlightsSection />
      <CoursesPreview />
      <GalleryPreview />
    </>
  );
}
