import Lol from "./../../lia/lol";
import { Title } from "solid-start";
import Counter from "~/components/Counter";

// export function Lol(){
//   return <h1>Lol component</h1>
// }
export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Lol />
    </main>
  );
}

const solidStartDefault =
  <>
    <Counter />
    <p>
      Visit{" "}
      <a href="https://start.solidjs.com" target="_blank">
        start.solidjs.com
      </a>{" "}
      to learn how to build SolidStart apps.
    </p>
  </>
