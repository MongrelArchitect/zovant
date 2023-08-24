import Banner from './Banner';
import Hero from './Hero';
import Info from './Info';
import '../styles/home.css';

import info01 from '../assets/images/info01.jpg';
import info02 from '../assets/images/info02.jpg';

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <div className="info">
        <Info
          heading="Our Story"
          content="Lorem ipsa vero iste minus ex aliquam, aliquam. Reprehenderit consequuntur eveniet inventore sunt aut voluptatibus Quae dicta quos officia fugit delectus placeat Harum commodi quisquam rem possimus illo aliquid, alias! Dolor quisquam praesentium mollitia ipsum sapiente? Ex sunt dolorum voluptatum eum corporis blanditiis, nemo eum Sunt consequatur voluptatem impedit ipsam quisquam Magnam vero ipsam aspernatur culpa eveniet! Blanditiis iste nobis illo voluptatum ipsam Expedita numquam ad ipsam saepe dolore est Doloribus a eos obcaecati veritatis repellat, eius? Laboriosam minima id."
        />
        <Banner content="A banner goes here" />
        <Info
          heading="Another Section"
          content="Amet officiis similique necessitatibus sunt repellendus perspiciatis! Soluta veniam voluptatem vitae dolorum consectetur officiis Officia nesciunt fugit nihil quasi ad."
          image={info01}
        />
        <Info
          heading="Something"
          content="Adipisicing quaerat omnis quasi iste necessitatibus molestias Eaque rerum aut nemo provident itaque. Rerum perferendis sequi ducimus molestiae debitis est Commodi expedita aliquam soluta temporibus soluta. Accusantium praesentium repellendus sed aspernatur enim architecto. Dolorem quibusdam vitae repellat porro natus autem"
          image={info02}
        />
      </div>
    </div>
  );
}
