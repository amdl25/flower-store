import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/add_icon.svg';
import list_product_icon from '../../assets/list_icon.svg';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-item'>
                <img src={add_product_icon} className='icon-add' alt=""/>
                <Link to={'/addproduct'} style={{textDecoration: "none"}}>
                    <p>Adaugă produs</p>
                </Link>
                <Link to={'/addflower'} style={{textDecoration: "none"}}>
                    <p>Adaugă floare</p>
                </Link>
                <Link to={'/addoccasion'} style={{textDecoration: "none"}}>
                    <p>Adaugă ocazie</p>
                </Link>
                <Link to={'/addpromocode'} style={{textDecoration: "none"}}>
                    <p>Adaugă cod promoțional</p>
                </Link>
                <Link to={'/addmonthlyflowersubscription'} style={{textDecoration: "none"}}>
                    <p>Adaugă floarea lunii</p>
                </Link>
            </div>
            <div className='sidebar-item'>
                <img src={list_product_icon} className='icon-list' alt=""/>
                <Link to={'/listproduct'} style={{textDecoration: "none"}}>
                    <p>Listă produse</p>
                </Link>
                <Link to={'/listflower'} style={{textDecoration: "none"}}>
                    <p>Listă flori</p>
                </Link>
                <Link to={'/listoccasion'} style={{textDecoration: "none"}}>
                    <p>Listă ocazii</p>
                </Link>
                <Link to={'/listpromocode'} style={{textDecoration: "none"}}>
                    <p>Listă coduri promoționale</p>
                </Link>
                <Link to={'/listmonthlyflowersubscription'} style={{textDecoration: "none"}}>
                    <p>Listă floarea lunii</p>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
