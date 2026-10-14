import {expect,it} from 'vitest';
import {isStoredLessonVideo,storedVideoPath,MAX_VIDEO_BYTES} from '../src/lib/lessonVideos';
it('accepts only canonical private MP4 references',()=>{
 const ref='storage:ndm-lesson-videos/abc-123/uuid-123.mp4';
 expect(isStoredLessonVideo(ref)).toBe(true);
 expect(storedVideoPath(ref)).toBe('abc-123/uuid-123.mp4');
 for(const url of ['https://evil.test/movie.mp4','storage:other/a.mp4','storage:ndm-lesson-videos/../private.mp4','storage:ndm-lesson-videos/a.mp4?token=abc']) expect(isStoredLessonVideo(url)).toBe(false);
 expect(MAX_VIDEO_BYTES).toBeLessThan(50*1024*1024);
});
