import Navbar from '../../components/Navbar';
import CultureCard from '../../components/CultureCard';
import styles from './CulturesPage.module.css';
import cultureImage from '../../assets/images/kathakali2.jpg';
import cultureImage2 from '../../assets/images/kathakali3.jpg';
import cultureImage3 from '../../assets/images/kathakali4.jpg';

const cultureData = [
  { name: 'Kathakali', url: 'kathakali', imageUrl: cultureImage },
  { name: 'Culture 2', url: 'culture2', imageUrl: cultureImage2 },
  { name: 'Culture 3', url: 'culture3', imageUrl: cultureImage3 },
];

function CulturesPage() {
  return (
    <div className={styles.culturesPage}>
      <Navbar />
      <h1 className={styles.pageTitle}>Cultures</h1>
      <div className={styles.cultureList}>
        {cultureData.map((culture) => (
          <CultureCard
            key={culture.name}
            name={culture.name}
            url={culture.url}
            imageUrl={culture.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default CulturesPage;
