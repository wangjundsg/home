import struct, zlib, os

def create_png(width, height, r, g, b):
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        return struct.pack('>I', len(data)) + c + crc

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))

    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            raw += bytes([r, g, b])

    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')

    return header + ihdr + idat + iend

base = 'assets/icons'
os.makedirs(base, exist_ok=True)

# Create 192x192 icon (coral color)
with open(f'{base}/icon-192.png', 'wb') as f:
    f.write(create_png(192, 192, 232, 115, 74))

# Create 512x512 icon
with open(f'{base}/icon-512.png', 'wb') as f:
    f.write(create_png(512, 512, 232, 115, 74))

print(f'icon-192.png: {os.path.getsize(f"{base}/icon-192.png")} bytes')
print(f'icon-512.png: {os.path.getsize(f"{base}/icon-512.png")} bytes')
print('Done!')
