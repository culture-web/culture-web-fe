import kireedam from 'assets/images/kathakali-ornaments/kireedam.png';
import thoda from 'assets/images/kathakali-ornaments/thoda.png';
import chevippuvu from 'assets/images/kathakali-ornaments/chevippuvu.png';
import chutti from 'assets/images/kathakali-ornaments/chutti.png';
import kazhuthunada from 'assets/images/kathakali-ornaments/kazhuthunada.png';
import kazhuttaram from 'assets/images/kathakali-ornaments/kazhuttaram.png';
import paruttikkaimani from 'assets/images/kathakali-ornaments/paruttikkaimani.png';
import tolputtu from 'assets/images/kathakali-ornaments/tolputtu.png';
import kuralaram from 'assets/images/kathakali-ornaments/kuralaram.png';
import uttariya from 'assets/images/kathakali-ornaments/uttariya.png';
import kastakatakam from 'assets/images/kathakali-ornaments/kastakatakam.png';
import kalases from 'assets/images/kathakali-ornaments/kalases.png';
import pattuval from 'assets/images/kathakali-ornaments/pattuval.png';
import patiarannanam from 'assets/images/kathakali-ornaments/patiarannanam.png';
import ottanakku from 'assets/images/kathakali-ornaments/ottanakku.png';
import tantappatippu from 'assets/images/kathakali-ornaments/tantappatippu.png';

interface Ornament {
  id: string;
  name: string;
  pathD: string;   // SVG path "d" string
  tooltipPosition: { top: string; left: string };  // positions for tooltip
  description: string | React.ReactNode;          // tooltip content (can be multiline)
  image: string;
}

const ornamentsData: Ornament[] = [
  {
    id: 'kireedam',
    name: 'Kireedam',
    pathD: 'M 420.2 245.2 L 372.2 259.2 L 342.2 289.2 L 317.2 334.2 L 316.2 385.2 L 336.2 436.2 L 371.2 469.2 L 391.2 445.2 L 452.2 429.2 L 479.2 436.2 L 491.2 468.2 L 519.2 457.2 L 548.2 412.2 L 560.2 371.2 L 548.2 321.2 L 516.2 273.2 L 466.2 249.2 L 415.2 244.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kireedam,
  },
  {
    id: 'thoda1',
    name: 'Thoda',
    pathD: 'M 374.2 425.0 L 361.2 438.0 L 363.2 451.0 L 375.2 460.0 L 387.2 458.0 L 391.2 431.0 L 374.2 424.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: thoda,
  },
  {
    id: 'thoda2',
    name: 'Thoda',
    pathD: 'M 480.2 422.6 L 496.2 418.6 L 509.2 426.6 L 509.2 441.6 L 499.2 451.6 L 483.2 448.6 L 479.2 423.6 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: thoda,
  },
  {
    id: 'chevippuvu1',
    name: 'Chevippuvu',
    pathD: 'M 377.2 472.8 L 369.2 480.8 L 369.2 491.8 L 376.2 499.8 L 389.2 496.8 L 396.2 485.8 L 392.2 476.8 L 380.2 471.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: chevippuvu,
  },
  {
    id: 'chevippuvu2',
    name: 'Chevippuvu',
    pathD: 'M 491.2 464.0 L 481.2 470.8 L 479.2 480.8 L 484.2 488.8 L 494.2 492.8 L 504.2 487.8 L 508.2 477.8 L 504.2 466.8 L 491.2 461.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: chevippuvu,
  },
  {
    id: 'chutti',
    name: 'Chutti',
    pathD: 'M 398.2 492.0 L 382.2 498.0 L 370.2 504.0 L 366.2 512.0 L 369.2 519.0 L 382.2 525.0 L 398.2 528.0 L 421.2 530.0 L 471.2 528.0 L 506.2 516.0 L 513.2 508.0 L 509.2 500.0 L 478.2 487.0 L 475.2 511.0 L 468.2 519.0 L 440.2 522.0 L 402.2 517.0 L 397.2 491.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: chutti,
  },
  {
    id: 'Kazhuthu nada',
    name: 'Kazhuthu nada',
    pathD: 'M 404.2 538.2 L 403.2 545.2 L 424.2 554.2 L 443.2 555.2 L 471.2 548.2 L 472.2 540.2 L 455.2 545.2 L 437.2 548.2 L 419.2 545.2 L 404.2 537.2 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kazhuthunada,
  },
  {
    id: 'Kazhuttaram',
    name: 'Kazhuttaram',
    pathD: 'M 401.2 546.6 L 391.2 592.6 L 386.2 649.6 L 390.2 669.6 L 407.2 686.6 L 428.2 681.6 L 449.2 660.6 L 462.2 622.6 L 472.2 548.6 L 446.2 555.6 L 423.2 553.6 L 402.2 545.6 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kazhuttaram,
  },
  {
    id: 'Paruttikkaimani1',
    name: 'Paruttikkaimani',
    pathD: 'M 258.2 559.6 L 253.2 577.6 L 273.2 576.6 L 289.2 586.6 L 299.2 580.6 L 278.2 556.6 L 257.2 561.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: paruttikkaimani,
  },
  {
    id: 'Paruttikkaimani2',
    name: 'Paruttikkaimani',
    pathD: 'M 567.2 609.8 L 567.2 622.8 L 612.2 614.8 L 612.2 625.8 L 625.2 604.8 L 619.2 596.8 L 579.2 599.8 L 567.2 607.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: paruttikkaimani,
  },
  {
    id: 'Tolputtu1',
    name: 'Tolputtu',
    pathD: 'M 282.2 558.8 L 295.2 573.8 L 337.2 541.8 L 346.2 540.8 L 336.2 531.8 L 326.2 539.8 L 306.2 544.8 L 284.2 560.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: tolputtu,
  },
  {
    id: 'Tolputtu2',
    name: 'Tolputtu',
    pathD: 'M 546.2 556.0 L 571.2 601.0 L 601.2 598.0 L 577.2 567.0 L 559.2 553.0 L 546.2 555.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: tolputtu,
  },
  {
    id: 'Kuralaram',
    name: 'Kuralaram',
    pathD: 'M 359.2 667.2 L 357.2 692.2 L 398.2 708.2 L 398.2 697.2 L 406.2 688.2 L 423.2 688.2 L 426.2 704.2 L 422.2 712.2 L 448.2 708.2 L 482.2 694.2 L 485.2 680.2 L 472.2 671.2 L 445.2 683.2 L 421.2 683.8 L 385.2 679.8 L 362.2 666.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kuralaram,
  },
  {
    id: 'Uttariya1',
    name: 'Uttariya',
    pathD: 'M 383.2 542.6 L 338.2 540.6 L 293.2 574.6 L 275.2 634.6 L 270.2 759.6 L 276.2 781.6 L 260.2 811.6 L 248.2 839.6 L 256.2 859.6 L 230.2 906.6 L 225.2 945.6 L 251.2 962.6 L 291.2 961.6 L 300.2 950.6 L 330.2 959.6 L 373.2 946.6 L 384.2 943.6 L 351.2 887.6 L 359.2 818.6 L 348.2 803.6 L 358.2 765.8 L 357.2 679.8 L 366.2 628.8 L 369.2 574.8 L 384.2 542.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: uttariya,
  },
  {
    id: 'Uttariya2',
    name: 'Uttariya',
    pathD: 'M 487.2 541.8 L 494.2 799.8 L 493.2 862.8 L 461.2 944.8 L 486.2 968.8 L 534.2 959.8 L 570.2 973.8 L 615.2 999.8 L 671.2 974.8 L 670.2 956.8 L 646.2 929.8 L 613.2 876.8 L 600.2 772.8 L 611.2 765.8 L 593.2 737.8 L 576.2 625.8 L 540.2 559.8 L 517.2 545.8 L 488.2 540.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: uttariya,
  },
  {
    id: 'Kastakatakam1',
    name: 'Kastakatakam',
    pathD: 'M 81.2 588.0 L 89.2 599.0 L 108.2 608.0 L 96.2 616.0 L 88.2 644.0 L 69.2 645.0 L 74.2 621.0 L 68.2 611.0 L 49.2 603.0 L 68.2 593.0 L 79.2 588.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kastakatakam,
  },
  {
    id: 'Kastakatakam2',
    name: 'Kastakatakam',
    pathD: 'M 557.2 664.8 L 573.2 675.8 L 586.2 690.8 L 576.2 716.8 L 595.2 727.8 L 600.2 721.8 L 615.2 717.8 L 622.2 704.8 L 610.2 691.8 L 589.2 673.8 L 589.2 664.8 L 580.2 652.8 L 557.2 659.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kastakatakam,
  },
  {
    id: 'Kalases1',
    name: 'Kalases',
    pathD: 'M 89.0 590.8 L 97.0 611.8 L 98.0 630.8 L 85.0 644.8 L 120.0 651.8 L 133.0 633.8 L 133.0 613.8 L 124.0 595.8 L 88.0 590.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kalases,
  },
  {
    id: 'Kalases2',
    name: 'Kalases',
    pathD: 'M 593.2 671.0 L 605.2 682.0 L 608.2 697.0 L 604.2 716.0 L 597.2 723.0 L 604.2 728.0 L 618.2 725.0 L 631.2 709.0 L 633.2 689.0 L 622.2 673.0 L 609.2 667.0 L 593.2 670.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: kalases,
  },
  {
    id: 'Pattu Val1',
    name: 'Pattu Val',
    pathD: 'M 392.2 532.0 L 371.2 566.0 L 365.2 628.0 L 370.2 655.0 L 365.2 685.0 L 367.2 818.0 L 353.2 874.0 L 351.2 889.0 L 371.2 905.0 L 393.2 904.0 L 414.2 889.0 L 415.2 873.0 L 402.2 858.0 L 391.2 847.0 L 392.2 837.0 L 381.2 826.0 L 385.2 793.0 L 384.2 667.0 L 379.2 655.0 L 385.2 643.0 L 393.2 566.0 L 403.2 543.0 L 395.2 532.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: pattuval,
  },
  {
    id: 'Pattu Val2',
    name: 'Pattu Val',
    pathD: 'M 473.2 531.2 L 463.2 605.2 L 460.2 657.2 L 449.2 705.2 L 442.2 832.2 L 426.2 873.2 L 410.2 890.2 L 412.2 910.2 L 440.2 920.2 L 473.2 904.2 L 459.2 865.2 L 460.2 850.2 L 454.2 840.2 L 471.2 750.2 L 472.2 663.8 L 487.2 537.8 L 473.2 526.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: pattuval,
  },
  {
    id: 'Patiarannanam',
    name: 'Patiarannanam',
    pathD: 'M 335.2 744.0 L 352.2 863.0 L 370.2 911.0 L 417.2 946.0 L 455.2 938.0 L 486.2 888.0 L 509.2 849.0 L 536.2 748.0 L 431.2 751.0 L 417.2 745.0 L 401.2 751.0 L 334.2 744.0 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: patiarannanam,
  },
  {
    id: 'Ottanakku',
    name: 'Ottanakku',
    pathD: 'M 373.2 792.4 L 373.2 941.4 L 385.2 1000.4 L 408.2 1028.4 L 410.2 1045.4 L 423.2 1054.4 L 436.2 1048.4 L 437.2 1030.4 L 455.2 1006.4 L 467.2 925.4 L 465.2 793.4 L 373.2 790.4 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: ottanakku,
  },
  {
    id: 'Tantappatippu1',
    name: 'Tantappatippu',
    pathD: 'M 261.2 1215.8 L 258.2 1232.8 L 248.2 1248.8 L 260.2 1261.8 L 301.2 1243.8 L 300.2 1228.8 L 282.2 1233.8 L 274.2 1228.8 L 268.2 1231.8 L 270.2 1220.8 L 263.2 1215.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: tantappatippu,
  },
  {
    id: 'Tantappatippu2',
    name: 'Tantappatippu',
    pathD: 'M 550.2 1229.8 L 552.2 1251.8 L 581.2 1260.8 L 603.2 1254.8 L 604.2 1239.8 L 594.2 1222.8 L 583.2 1232.8 L 573.2 1232.8 L 556.2 1224.8 L 549.2 1227.8 Z',
    tooltipPosition: { top: '12%', left: '88%' },
    description: '.',
    image: tantappatippu,
  },
];

export default ornamentsData;
