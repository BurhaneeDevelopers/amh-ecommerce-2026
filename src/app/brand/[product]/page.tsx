import { Container } from '@/components/layout/container'
import React from 'react'
import { Wrapper } from '../../../components/layout/wrapper';
import MainColumn from '@/components/layout/product-listing/main-column';

const Products = () => {
    return (
        <Container>
            <Wrapper>
                <MainColumn />
            </Wrapper>
        </Container>
    )
}

export default Products