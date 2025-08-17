import { Container } from "@/components/layout/container";
import MainColumn from "@/components/layout/home/main-column";
import { Wrapper } from "@/components/layout/wrapper";

export default function Home() {
  return (
    <Container>
      <Wrapper>
        <MainColumn />
      </Wrapper>
    </Container>
  );
}
