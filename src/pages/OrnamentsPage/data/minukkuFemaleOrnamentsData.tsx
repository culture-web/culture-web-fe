import kazhuthunada from 'assets/images/kathakali-ornaments/kazhuthunada.png';
import kastakatakam from 'assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from 'assets/images/kathakali-ornaments/kalases.png';
import veil from 'assets/images/kathakali-ornaments/veil.png';
import katila from 'assets/images/kathakali-ornaments/katila.png';
import kurunira from 'assets/images/kathakali-ornaments/kurunira.png';
import kazhuttaramfemale from 'assets/images/kathakali-ornaments/kazhuttaramfemale.png';
import mulakkuralaram from 'assets/images/kathakali-ornaments/mulakkuralaram.png';
import tolputtufemale from 'assets/images/kathakali-ornaments/tolputtufemale.png';
import paruttikkaimanifemale from 'assets/images/kathakali-ornaments/paruttikkaimanifemale.png';
import patiarannanamfemale from 'assets/images/kathakali-ornaments/patiarannanamfemale.png';

import type { Ornament } from './types';



const minukkuFemaleOrnamentsData: Ornament[] = [
  {
    id: 'veil',
    name: 'Veil',
    pathD: 'M 397.2 17.0 L 259.2 98.0 L 220.2 140.0 L 136.2 344.0 L 122.2 552.0 L 127.2 664.0 L 94.2 730.0 L 83.2 772.0 L 118.2 808.0 L 137.2 812.0 L 150.2 753.0 L 151.2 673.0 L 167.2 650.0 L 178.2 627.0 L 150.2 473.0 L 167.2 379.0 L 206.2 320.0 L 208.2 266.0 L 231.2 233.0 L 249.2 188.0 L 259.2 128.0 L 297.2 86.0 L 335.2 73.0 L 373.2 78.0 L 394.2 101.0 L 401.2 126.0 L 404.2 169.0 L 424.2 208.0 L 409.2 226.0 L 403.2 254.0 L 391.2 264.0 L 391.2 281.0 L 439.2 309.0 L 450.2 323.0 L 458.2 299.0 L 472.2 295.0 L 502.2 318.0 L 527.2 379.0 L 539.2 379.0 L 436.2 66.0 L 431.2 30.0 L 420.2 20.0 L 398.2 15.0 Z',
    tooltipPosition: { top: '10%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Silk cloth covering the back of the head</li>
        <li>Pink/gold poly tissue brocade</li>
      </ul>
    ),
    image: veil,
  },
  {
    id: 'kurunira',
    name: 'Kurunira',
    pathD: 'M 248.2 166.0 L 261.2 129.0 L 294.2 91.0 L 333.2 74.0 L 364.2 77.0 L 387.2 90.0 L 396.4 109.0 L 396.4 129.0 L 378.4 113.0 L 356.4 103.0 L 330.4 108.0 L 283.4 146.0 L 246.4 166.0 Z',
    tooltipPosition: { top: '20%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's headband</li>
        <li>Chain of dangling ornaments</li>
        <li>Red wool with black cotton backing</li>
      </ul>
    ),
    image: kurunira,
  },
  {
    id: 'katila1',
    name: 'Katila',
    pathD: 'M 263.2 157.0 L 232.2 173.6 L 238.2 193.6 L 250.2 195.6 L 251.2 219.6 L 259.2 238.6 L 272.2 245.6 L 292.2 229.6 L 297.2 211.6 L 288.2 198.6 L 294.2 185.6 L 300.2 176.6 L 265.2 153.6 Z',
    tooltipPosition: { top: '20%', left: '93%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's earrings</li>
        <li>Tied around head with red cotton cord</li>
        <li>Carved wood decorated with gilt foil, plastic silver</li>
      </ul>
    ),
    image: katila,
  },
  {
    id: 'katila2',
    name: 'Katila',
    pathD: 'M 396.2 158.0 L 407.2 230.0 L 426.2 214.0 L 414.2 177.0 L 396.2 158.0 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's earrings</li>
        <li>Tied around head with red cotton cord</li>
        <li>Carved wood decorated with gilt foil, plastic silver</li>
      </ul>
    ),
    image: katila,
  },
  {
    id: 'Kazhuthu nada',
    name: 'Kazhuthu nada',
    pathD: 'M 264.2 266.2 L 257.2 277.2 L 315.2 298.2 L 368.2 303.2 L 388.2 296.2 L 392.2 276.2 L 367.2 285.2 L 325.2 282.2 L 265.2 265.2 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Choker</li>
        <li>Black cotton and red woolover cotton tape</li>
        <li>Worn over kazhuttartam (necklace) to keep in place</li>
      </ul>
    ),
    image: kazhuthunada,
  },
  {
    id: 'Kazhuttaram',
    name: 'Kazhuttaram',
    pathD: 'M 266.2 279.8 L 294.2 339.0 L 309.2 392.0 L 320.2 459.0 L 372.2 542.0 L 418.2 568.0 L 452.2 574.0 L 466.2 552.0 L 474.2 438.0 L 463.2 402.0 L 426.2 360.0 L 384.2 298.0 L 360.2 303.0 L 322.2 297.0 L 265.2 278.0 Z',
    tooltipPosition: { top: '22%', left: '95%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's Necklace</li>
        <li>Many strings of gold colored plastic beads</li>
        <li>Two red wool pompoms</li>
      </ul>
    ),
    image: kazhuttaramfemale,
  },
  {
    id: 'mulakkuralaram',
    name: 'Mulakkuralaram',
    pathD: 'M 324.2 521.8 L 331.2 550.8 L 343.2 595.8 L 406.2 644.8 L 468.2 649.8 L 520.2 629.8 L 539.2 595.8 L 545.2 565.8 L 527.2 514.8 L 528.2 491.8 L 518.2 475.8 L 493.2 478.8 L 486.2 491.8 L 472.2 526.8 L 458.2 553.8 L 441.2 563.8 L 407.2 552.8 L 371.2 517.8 L 329.2 518.8 Z',
    tooltipPosition: { top: '30%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's breastplate</li>
        <li>Red wool felt decorated with gilt foil, wool multicolored tassels, green and red plastic jewels with gilt underneath</li>
        <li>Ties to body with red cotton cord and cotton twill</li>
      </ul>
    ),
    image: mulakkuralaram,
  },
  {
    id: 'Tolputtu1',
    name: 'Tolputtu',
    pathD: 'M 168.2 378.8 L 173.2 417.8 L 179.2 426.8 L 180.2 464.8 L 258.2 458.8 L 256.2 400.8 L 239.2 356.8 L 203.2 347.8 L 177.2 360.8 L 166.2 377.8 Z',
    tooltipPosition: { top: '27%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's epaulettes</li>
        <li>Carved wood, red wool, gilt foil, green & red plastic jewels, cotton cord</li>
      </ul>
    ),
    image: tolputtufemale,
  },
  {
    id: 'Tolputtu2',
    name: 'Tolputtu',
    pathD: 'M 449.2 320.0 L 480.2 402.0 L 526.2 385.0 L 505.2 320.0 L 473.2 296.0 L 461.2 296.4 L 450.2 307.4 L 450.2 320.0 Z',
    tooltipPosition: { top: '27%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's epaulettes</li>
        <li>Carved wood, red wool, gilt foil, green & red plastic jewels, cotton cord</li>
      </ul>
    ),
    image: tolputtufemale,
  },  
  {
    id: 'Paruttikkaimani1',
    name: 'Paruttikkaimani',
    pathD: 'M 171.2 463.8 L 162.2 482.8 L 199.2 483.8 L 267.2 470.8 L 275.2 464.8 L 255.2 458.8 L 217.2 465.8 L 187.2 469.8 L 171.2 465.8 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's Upper Arm Band</li>
        <li>6 ogee domes</li>
        <li>These are slightly mismatched, as if carved by student/apprentice, or combined from two or more existing sets</li>
      </ul>
    ),
    image: paruttikkaimanifemale,
  },
  {
    id: 'Paruttikkaimani2',
    name: 'Paruttikkaimani',
    pathD: 'M 487.2 399.8 L 506.2 391.8 L 542.2 385.8 L 545.2 390.8 L 522.2 399.8 L 490.2 407.8 L 484.2 398.8 Z',
    tooltipPosition: { top: '32%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's Upper Arm Band</li>
        <li>6 ogee domes</li>
        <li>These are slightly mismatched, as if carved by student/apprentice, or combined from two or more existing sets</li>
      </ul>
    ),
    image: paruttikkaimanifemale,
  },  
  {
    id: 'Patiarannanam',
    name: 'Patiarannanam',
    pathD: 'M 540.2 603.8 L 506.2 630.8 L 502.2 651.8 L 486.2 667.8 L 459.2 675.8 L 463.2 686.8 L 515.2 689.8 L 539.2 657.8 L 558.2 639.8 L 541.2 602.8 Z',
    tooltipPosition: { top: '37%', left: '88%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Women's belt</li>
        <li>Carved wood, 7 belt pieces, two strings of beads</li>
        <li>Red wool gilt foil, plastic gems, red cotton cord</li>
        <li>Not symmetrical, but balanced</li>
      </ul>
    ),
    image: patiarannanamfemale,
  },
  {
    id: 'Kalases1',
    name: 'Kalases',
    pathD: 'M 543.2 586.8 L 552.2 605.8 L 615.2 613.8 L 615.2 594.8 L 596.2 576.8 L 565.2 577.8 L 545.2 587.8 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bracelet cuffs</li>
        <li>Gilt foil, strings of silver toned beads</li>
      </ul>
    ),
    image: kalases,
  },
  {
    id: 'Kalases2',
    name: 'Kalases',
    pathD: 'M 355.2 647.8 L 342.2 689.8 L 336.2 729.8 L 382.2 743.8 L 402.2 704.8 L 410.2 666.8 L 354.2 645.8 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Bracelet cuffs</li>
        <li>Gilt foil, strings of silver toned beads</li>
      </ul>
    ),
    image: kalases,
  },  
  {
    id: 'Kastakatakam1',
    name: 'Kastakatakam',
    pathD: 'M 411.2 650.8 L 406.2 688.8 L 387.2 744.8 L 406.2 757.8 L 443.2 763.8 L 449.2 749.8 L 445.2 734.8 L 464.2 693.8 L 457.2 682.8 L 466.2 671.8 L 461.2 651.8 L 445.2 651.8 L 433.2 640.8 L 411.2 649.8 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Wrist decorations</li>
        <li>Green wool tassels, red cord ties</li>
        <li>Tied to wrist below Kalases (bracelet cuffs)</li>
      </ul>
    ),
    image: kastakatakam,
  },
  {
    id: 'Kastakatakam2',
    name: 'Kastakatakam',
    pathD: 'M 545.2 607.8 L 554.2 633.8 L 575.2 644.8 L 589.2 642.8 L 610.2 666.8 L 618.2 684.8 L 638.2 679.8 L 643.2 662.8 L 645.2 641.8 L 624.2 626.8 L 609.2 607.8 L 583.2 609.8 L 566.2 598.8 L 547.2 607.8 Z',
    tooltipPosition: { top: '20%', left: '0%' },
    description: (
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        <li>Wrist decorations</li>
        <li>Green wool tassels, red cord ties</li>
        <li>Tied to wrist below Kalases (bracelet cuffs)</li>
      </ul>
    ),
    image: kastakatakam,
  }
];

export default minukkuFemaleOrnamentsData;
