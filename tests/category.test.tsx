import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ screenParams: {category:'Violão',courseId:'one'}, publishedLessons: [] as any[], modules: [], courses: [], favoriteLessons: [], completedLessons: [], goBack:vi.fn(), addToWatchedHistory:vi.fn(), toggleLessonFavorite:vi.fn(), toggleLessonComplete:vi.fn() }));
vi.mock('../src/context/AppContext', () => ({useApp:()=>state}));
import {CategoryPage} from '../src/pages/CategoryPage';
afterEach(cleanup);
it('renders an empty state when no published lesson exists', () => {
  render(<CategoryPage/>);
  expect(screen.getByText(/Nenhuma aula publicada/)).toBeTruthy();
});
it('does not mix published lessons from courses in the same category',()=>{
 state.publishedLessons=[{id:'a',courseId:'one',title:'Course one',level:'Nível Zero',category:'Violão',videoUrl:'https://www.youtube.com/embed/abc123'}, {id:'b',courseId:'two',title:'Course two',level:'Nível Zero',category:'Violão',videoUrl:'https://www.youtube.com/embed/def456'}];
 render(<CategoryPage/>);
 expect(screen.queryByText('Course two')).toBeNull();expect(screen.getByTitle('Course one')).toBeTruthy();
});
it('removes the playing lesson as soon as it is unpublished',()=>{
 state.publishedLessons=[{id:'a',courseId:'one',title:'Removed lesson',level:'Nível Zero',category:'Violão',videoUrl:'https://www.youtube.com/embed/abc123'}];
 const view=render(<CategoryPage/>);state.publishedLessons=[];view.rerender(<CategoryPage/>);
 expect(screen.queryByTitle('Removed lesson')).toBeNull();expect(screen.getByText(/Nenhuma aula publicada/)).toBeTruthy();
});
