import React, { useEffect, useState } from 'react';
import { IonChip, IonContent, IonLabel, IonPage, IonSkeletonText } from '@ionic/react';
import { RouteComponentProps, useHistory, useParams } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/searchBar";
import ProductRow, { Params } from "../components/ProductRow";
import { connect } from 'react-redux';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../config/firebase';
export interface IProduct {
  id: string,
  store_id: string,
  category_code: string,
  name: string,
  cost: number,
  images: string[],
  description: string,
  size: string,
}

interface IProps {
  products: IProduct[],
}
const CategoriesPage: React.FC<IProps & RouteComponentProps<any>> = props => {
  const history = useHistory();
  const { category } = useParams<Params>();
  const [products, setProducts] = useState<IProduct[]>();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('category_code', '==', category ))
        const productsSnapshot = await getDocs(q);
        const data = productsSnapshot.docs.map(doc => doc.data());
        setProducts(data as IProduct[]);
      } catch (error) {
        console.log (error)
      }
    }
    getProducts();
  }, [category])

  const productSkeleton = (key: string) =>
    <div key={key} className="w-11/12 flex bg-white shadow-lg rounded-xl mb-4">
      <div className="w-1/3">
        <IonSkeletonText animated className="h-full rounded-l-xl" />
      </div>
      <div className="w-2/3 p-4">
        <IonSkeletonText animated className="h-6 mb-4" />
        <IonSkeletonText animated className="w-7/12" />
        <IonSkeletonText animated className="w-10/12" />
        <IonSkeletonText animated className="w-9/12" />
        <IonSkeletonText animated className="w-8/12" />
        <div className="flex flex-wrap item-center justify-between mt-3">
          <IonSkeletonText animated className="w-4/12 h-6" />
          <IonSkeletonText animated className="w-6/12 h-6"/>
        </div>
      </div>
    </div>

  return (
    <IonPage className="font-inter">
      <Header showBack={true}/>
      <IonContent>
        <div className="sticky w-full top-0 my-2 px-4  md:flex md:justify-center bg-white">
          {/* {categories.map(item => {
            const isTheSameCategory = (item.code === category.toLowerCase().replace(' ', '_'))
            return (
              <IonChip key={item.code}
                onClick={() => history.push(`${item.code}`)}
                className={`${isTheSameCategory && 'bg-green text-white font-bold' } text-lg`}>
                <span>{item.emoji}</span>
                <IonLabel>{item.name}</IonLabel>
              </IonChip>
            )
          })} */}
        </div>

        <div className="w-full md:w-9/12 mx-auto flex flex-wrap justify-center overflow-y-auto pt-4">
          {products
          ? products.map(product => <ProductRow key={product.id} product={product}/>)
          : [1,2,3,4].map(skeleton => (productSkeleton((skeleton * 2).toString()))) }
        </div>
      </IonContent>

      <Footer />
    </IonPage>
  );
};

const mapStateToProps = (state: any) => {
  return {
    products: state.shop.products,
  }
}

export default connect(mapStateToProps)(CategoriesPage);
