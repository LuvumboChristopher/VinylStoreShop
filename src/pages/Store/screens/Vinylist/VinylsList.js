import React, { useEffect, useReducer } from 'react'
import { Vinyl } from './Vinyl'
import axios from 'axios'

import { VinylList, SearchResultContainer } from '../../style.js'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}
const VinylsList = ({ search, handleAddToCart }) => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
    const fecthproducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const url = "https://vst-server.vercel.app/api/v1/products";
        axios.get(url).then((res) => {
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        });
      } catch (err) {
        const error = 'Erreur de serveur, réessayez plus tard'
        dispatch({ type: 'FETCH_FAIL', payload: error })
      }
    }
    fecthproducts()
  }, [])

  return (
    <>
      <>
        {loading ? (
          <SearchResultContainer>
            <p style={{ margin: "2rem auto" }}> En cours de chargement...</p>
          </SearchResultContainer>
        ) : error ? (
          <SearchResultContainer>
            <p style={{ margin: "2rem auto" }}>{error}</p>
          </SearchResultContainer>
        ) : products ? (
          <VinylList>
            {search(products).length === 0 ? (
              <SearchResultContainer>
                <p>Pas de resultats pour votre recherche</p>
              </SearchResultContainer>
            ) : (
              search(products).map((vinyl) => {
                return (
                  <Vinyl
                    key={vinyl._id}
                    {...vinyl}
                    handleAddToCart={handleAddToCart}
                  ></Vinyl>
                );
              })
            )}
          </VinylList>
        ) : (
          <SearchResultContainer>
            <p>Pas de resultats pour votre recherche...</p>
          </SearchResultContainer>
        )}
      </>
    </>
  );
}

export default VinylsList 
