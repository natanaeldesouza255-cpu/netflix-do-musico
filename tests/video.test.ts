import {expect,it} from 'vitest';
import {safeEmbedUrl} from '../src/lib/video';
it('rejects executable URLs, spoofed hosts, credentials and untrusted iframe providers',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,<script>alert(1)</script>','https://www.youtube.com.evil.invalid/embed/abc','https://attacker.invalid/video','https://user@www.youtube.com/embed/abc'])expect(safeEmbedUrl(url)).toBeNull();
});
it('accepts trusted HTTPS video embeds',()=>{
 expect(safeEmbedUrl('https://www.youtube.com/embed/abc-123')).toBe('https://www.youtube.com/embed/abc-123');
 expect(safeEmbedUrl('https://player.vimeo.com/video/123')).toBe('https://player.vimeo.com/video/123');
});
