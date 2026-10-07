'use client';
import Image from 'next/image';
import introductions from '../lib/module-introductions.json';
export type IntroductionId=keyof typeof introductions;
export function Introduction({id,onContinue}:{id:IntroductionId,onContinue?:()=>void}){const intro=introductions[id];return <section className="module-introduction" data-module={id}><Image className="module-introduction-art" src={intro.image} alt={intro.alt} width={1536} height={1024} priority unoptimized/><div className="module-introduction-copy"><small>{intro.designation}</small><h2>{intro.title}</h2><p className="intro-authors">{intro.authors}</p>{'series' in intro&&<p className="intro-series">{intro.series}</p>}{intro.paragraphs.map((p,i)=><p key={i}>{p}</p>)}{onContinue&&<button className="gold intro-continue" onClick={onContinue}>Continue into the desert</button>}</div></section>}
