export const ZOE_RIG_TEMPLATE = `
    <style>
      :host {
        --zoe-green: #12ea7b;
        --zoe-ink: #000;
        --zoe-highlight: #fff;
        display: block;
        width: 337px;
        max-width: 100%;
      }

      .motion-safe-area {
        box-sizing: border-box;
        display: grid;
        place-items: center;
        width: 100%;
        padding: 48px;
        overflow: visible;
      }

      svg {
        display: block;
        width: 241px;
        max-width: 100%;
        height: auto;
        overflow: visible;
      }

      [data-part] {
        transform-box: view-box;
        will-change: transform, opacity;
      }

      [data-part="root"],
      [data-part="legs"] {
        transform-origin: 120px 292px;
      }

      [data-part="leg-left"] {
        transform-origin: 103px 237px;
        transform: translateX(-3px) rotate(-1deg);
      }

      [data-part="leg-right"] {
        transform-origin: 128px 235px;
        transform: translateX(3px) rotate(1deg);
      }

      [data-part="body-surface"],
      [data-part="glasses"],
      [data-part="upper-overlay"],
      [data-part="character"] {
        transform-origin: 112px 225px;
      }

      [data-part="arm-left"] {
        transform-origin: 40px 137px;
      }

      [data-part="arm-right"] {
        transform-origin: 171px 115px;
      }

      [data-part="mouth-rest"],
      [data-part="mouth-wide"],
      [data-part="mouth-open"],
      [data-part="mouth-concerned"],
      [data-part="mouth-neutral"],
      [data-part="mouth-steady"],
      [data-part="mouth-small-open"],
      [data-part="mouth-discomfort"],
      [data-part="mouth-questioning"],
      [data-part="mouth-hopeful"] {
        transform-origin: 116px 174px;
      }

      [data-part="brows-attentive"],
      [data-part="eyes-wide"],
      [data-part="eyes-narrowed"],
      [data-part="eyes-curious"],
      [data-part="eyes-knowing"],
      [data-part="eyes-blink"] {
        transform-origin: 106px 90px;
      }

      [data-part="tear"] {
        transform-origin: 157px 112px;
      }

      [data-part="tension-left"] {
        transform-origin: 24px 114px;
      }

      [data-part="tension-right"] {
        transform-origin: 218px 118px;
      }

      [data-part="heart-left"] {
        transform-origin: 20px 82px;
      }

      [data-part="heart-right"] {
        transform-origin: 218px 77px;
      }

      [data-part="sparkle-left"] {
        transform-origin: 18px 62px;
      }

      [data-part="sparkle-upper-right"] {
        transform-origin: 212px 46px;
      }

      [data-part="sparkle-right"] {
        transform-origin: 225px 132px;
      }

      [data-part="orientation-left"] {
        transform-origin: 24px 78px;
      }

      [data-part="orientation-right"] {
        transform-origin: 216px 72px;
      }

      [data-part="calm-arc"] {
        transform-origin: 120px 225px;
      }

      [data-part="release-left"] {
        transform-origin: 20px 150px;
      }

      [data-part="release-right"] {
        transform-origin: 221px 144px;
      }

      [data-part="acceptance-glint"] {
        transform-origin: 78px 187px;
      }

      [data-part="repair-glint"] {
        transform-origin: 205px 172px;
      }

      [data-part="forward-glint-left"] {
        transform-origin: 190px 174px;
      }

      [data-part="forward-glint-right"] {
        transform-origin: 218px 142px;
      }

      [data-part="knowing-beat-left"] {
        transform-origin: 27px 88px;
      }

      [data-part="knowing-beat-right"] {
        transform-origin: 214px 86px;
      }

      [data-part="eyes-happy"],
      [data-part="eyes-concerned"],
      [data-part="eyes-wide"],
      [data-part="eyes-narrowed"],
      [data-part="eyes-curious"],
      [data-part="eyes-knowing"],
      [data-part="eyes-blink"],
      [data-part="mouth-wide"],
      [data-part="mouth-open"],
      [data-part="mouth-concerned"],
      [data-part="mouth-neutral"],
      [data-part="mouth-steady"],
      [data-part="mouth-small-open"],
      [data-part="mouth-discomfort"],
      [data-part="mouth-questioning"],
      [data-part="mouth-hopeful"],
      [data-part="brows-attentive"],
      [data-part="tear"],
      [data-part^="tension-"],
      [data-part^="heart-"],
      [data-part^="sparkle-"],
      [data-part^="orientation-"],
      [data-part="calm-arc"],
      [data-part^="release-"],
      [data-part="acceptance-glint"],
      [data-part="repair-glint"],
      [data-part^="forward-glint-"],
      [data-part^="knowing-beat-"] {
        opacity: 0;
      }
    </style>

    <div class="motion-safe-area">
      <svg
        viewBox="0 0 241 300"
        width="241"
        height="300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g data-part="root">
          <g data-part="character">
          <g data-part="body-surface">
            <path d="M148.808 44.2763C155 42.5171 161.587 42.7395 167.646 44.9124C172.197 46.6735 176.25 49.5206 179.45 53.2057C185.982 60.3737 190.251 71.5539 193.174 102.024C195.351 124.849 194.801 137.889 193.81 161.374C193.223 175.331 192.501 180.701 189.345 186.903C181.713 201.899 166.227 209.19 162.056 211.159C157.579 213.275 154.154 214.254 147.291 216.211C137.343 218.958 127.178 220.844 116.907 221.85C101.225 223.501 93.201 224.296 83.7211 221.373C79.5217 220.093 75.4956 218.302 71.7337 216.04C65.1528 211.832 57.2753 203.245 48.933 150.855C48.3703 147.283 48.7862 149.717 44.1502 93.7307C43.5019 85.9755 42.7436 76.7403 47.3428 66.6121C51.673 57.0711 58.5474 51.6033 62.6574 48.423C80.6142 34.4784 101.678 33.7444 110.522 34.0625C114.718 28.841 119.404 24.0323 124.515 19.702C140.551 6.17327 161.554 -3.40447 165.933 1.14587C166.812 2.12536 167.307 3.38955 167.328 4.70542C167.328 7.5188 164.575 9.59826 163.487 10.4423C158.337 14.6624 155.927 20.7662 152.319 29.9158C150.517 34.5259 149.337 39.355 148.808 44.2763Z" fill="var(--zoe-green)"/>
            <path d="M83.0851 39.7994C73.96 41.3406 66.2293 42.6495 56.9084 47.1386C50.6334 50.1722 43.9791 53.4749 38.7193 60.594C33.4594 67.7131 32.3586 74.7343 31.38 81.3885C29.0681 97.119 32.2118 110.073 36.493 127.014C39.2942 138.023 40.5908 139.797 43.2574 151.992C45.2879 161.228 45.08 162.708 47.3429 175.233C50.9147 194.964 52.7862 204.994 56.9084 212.566C60.0765 218.376 64.8348 227.097 74.4615 232.357C83.7089 237.409 94.6934 236.027 116.271 232.993C134.619 230.425 144.074 229.018 154.044 223.208C158.288 220.761 168.649 214.743 175.645 203.294C179.927 196.297 182.385 191.539 180.869 149.693C179.389 108.776 181.541 102.183 177.199 77.5232C173.089 54.1232 168.049 43.0164 158.851 38.6129C153.249 35.9218 144.674 35.0533 141.726 34.7598C135.096 34.087 129.861 34.5273 121.616 35.3958C118.314 35.7506 116.026 36.0319 113.91 36.3132C94.5099 38.8575 92.4916 38.2092 83.0851 39.7994Z" stroke="var(--zoe-ink)" stroke-width="8.56248" stroke-miterlimit="10"/>
            <path d="M124.246 29.2675C127.901 24.7768 132.072 20.7327 136.674 17.2188C137.897 16.2525 150.618 6.56467 153.126 8.85207C154.423 10.0753 153.42 14.9681 141.64 32.46L110.204 35.0166C107.947 33.4829 105.952 31.5953 104.295 29.4265C102.228 26.6987 101.971 25.1452 101.849 24.3257C101.727 23.5061 101.641 21.6102 102.644 20.6561C104.418 18.968 108.76 20.9374 113.335 23.1025C117.141 24.8423 120.792 26.9048 124.246 29.2675Z" fill="var(--zoe-ink)"/>
          </g>

          <g data-part="glasses">
            <path d="M90.0941 96.4462C94.4321 94.4689 99.1483 93.4589 103.916 93.4864C108.683 93.5138 113.387 94.5781 117.702 96.6052" stroke="var(--zoe-ink)" stroke-width="12.2321" stroke-miterlimit="10"/>
            <path d="M90.4733 129.155C85.9352 134.476 79.1586 135.124 66.6451 136.335C55.5261 137.412 48.2969 138.109 43.1961 133.461C39.2207 129.791 38.6703 124.066 37.4471 112.556C36.3707 102.44 35.8691 97.3759 38.4012 92.9846C42.1687 86.3792 49.5202 84.4221 58.4007 81.9757C67.4769 79.5292 79.9537 76.1776 87.0727 82.734C90.2653 85.6698 90.9992 90.0733 92.3325 98.6358C94.5955 113.29 96.0389 122.611 90.4733 129.155Z" stroke="var(--zoe-ink)" stroke-width="12.2321" stroke-miterlimit="10"/>
            <path d="M166.361 113.999C161.309 119.43 154.888 120.592 144.661 122.452C135.328 124.14 128.54 125.375 123.231 121.436C118.338 117.767 117.396 111.859 115.892 102.697C114.863 96.2236 114.937 89.6229 116.112 83.1744C117.262 76.7526 117.836 73.5478 119.94 70.9423C124.833 64.6917 133.665 64.5816 149.138 64.3982C159.169 64.2758 161.689 65.5357 163.205 66.5632C168.6 70.2329 169.884 76.7159 170.997 82.7463C172.453 90.7217 175.009 104.703 166.361 113.999Z" stroke="var(--zoe-ink)" stroke-width="12.2321" stroke-miterlimit="10"/>
          </g>

          <g data-part="legs">
            <defs>
              <clipPath id="zoe-leg-left-clip">
                <rect x="0" y="224" width="118" height="76"/>
              </clipPath>
              <clipPath id="zoe-leg-right-clip">
                <rect x="118" y="224" width="123" height="76"/>
              </clipPath>
              <g id="zoe-legs-shape">
            <path d="M45.3246 293.077C44.9801 290.557 45.067 287.997 45.5815 285.506C46.4744 280.98 47.453 276.014 51.245 270.754C54.5522 266.257 58.9806 262.706 64.0887 260.454C69.1921 258.128 74.7636 257.01 80.3696 257.188C85.6026 257.196 90.7809 258.252 95.5986 260.295C97.4329 261.105 99.1965 262.066 100.871 263.17C100.576 259.622 100.015 256.102 99.1948 252.638C97.9716 247.415 96.8707 245.666 96.1613 244.663C95.0383 243.164 93.7407 241.805 92.2959 240.614C90.9011 239.383 89.4033 238.274 87.819 237.299L139.194 229.96C139.561 230.582 139.704 231.312 139.597 232.027C139.389 233.128 138.509 233.666 137.591 234.583C136.647 235.715 135.827 236.946 135.145 238.253C133.184 241.937 131.685 245.848 130.68 249.898C129.772 253.506 129.211 257.192 129.004 260.907C133.492 257.958 138.313 255.547 143.365 253.727C147.221 252.173 151.27 251.152 155.401 250.693C161.567 249.91 167.829 250.819 173.517 253.323C178.267 255.537 182.422 258.849 185.639 262.986C188.911 267.097 191.275 271.853 192.575 276.943C193.769 281.117 194.334 285.446 194.251 289.787C194.66 290.535 194.855 291.382 194.813 292.233C194.737 293.374 194.255 294.45 193.455 295.267C191.939 295.267 189.639 295.145 186.838 295.022C177.652 294.631 171.364 294.068 166.251 293.665C157.053 292.955 150.031 292.649 144.074 292.441C134.007 292.001 124.161 291.597 112.65 291.964C105.445 292.197 97.4945 292.735 97.0909 292.759C95.2194 292.894 92.4304 293.077 88.8709 293.395C78.6082 294.313 70.7429 295.487 68.2109 295.842C63.9052 296.49 58.6209 297.395 52.5782 298.631C51.8688 299.157 49.9728 300.429 48.2726 299.854C46.2298 299.01 45.6793 295.573 45.3246 293.077ZM109.837 240.859C110.338 242.914 110.766 244.981 111.329 246.975C111.684 248.198 112.185 250.082 112.711 252.418L117.433 252.296C118.216 250.106 118.864 248.357 119.292 247.207C119.292 247.207 119.781 245.874 121.677 239.305C122.081 237.96 122.375 236.859 121.8 236.198C121.592 235.941 121.127 235.599 119.109 235.66C117.454 235.778 115.815 236.061 114.216 236.504C110.95 237.177 110.094 237.018 109.604 237.813C109.225 238.449 109.384 239.048 109.837 240.859Z" fill="var(--zoe-ink)"/>
              </g>
            </defs>
            <g data-part="leg-left" clip-path="url(#zoe-leg-left-clip)">
              <use href="#zoe-legs-shape"/>
            </g>
            <g data-part="leg-right" clip-path="url(#zoe-leg-right-clip)">
              <use href="#zoe-legs-shape"/>
            </g>
          </g>

          <g data-part="upper-overlay">
            <g data-part="eyes-open">
              <path d="M65.0427 124.923C73.0346 124.923 79.5133 118.444 79.5133 110.452C79.5133 102.46 73.0346 95.9814 65.0427 95.9814C57.0509 95.9814 50.5721 102.46 50.5721 110.452C50.5721 118.444 57.0509 124.923 65.0427 124.923Z" fill="var(--zoe-ink)"/>
              <path d="M143.817 108.324C151.37 108.324 157.493 102.201 157.493 94.6482C157.493 87.0954 151.37 80.9727 143.817 80.9727C136.265 80.9727 130.142 87.0954 130.142 94.6482C130.142 102.201 136.265 108.324 143.817 108.324Z" fill="var(--zoe-ink)"/>
              <path d="M59.6117 112.96C62.1721 112.96 64.2477 110.884 64.2477 108.324C64.2477 105.763 62.1721 103.688 59.6117 103.688C57.0513 103.688 54.9757 105.763 54.9757 108.324C54.9757 110.884 57.0513 112.96 59.6117 112.96Z" fill="var(--zoe-highlight)"/>
              <path d="M139.181 97.5715C141.742 97.5715 143.817 95.4959 143.817 92.9355C143.817 90.3752 141.742 88.2996 139.181 88.2996C136.621 88.2996 134.546 90.3752 134.546 92.9355C134.546 95.4959 136.621 97.5715 139.181 97.5715Z" fill="var(--zoe-highlight)"/>
            </g>

            <g data-part="eyes-happy">
              <path d="M51.5 111C58.2 102.5 70.2 101.4 78 107.5" stroke="var(--zoe-ink)" stroke-width="7" stroke-linecap="round"/>
              <path d="M130.5 95C136.7 86.7 149.3 84.9 157.5 91" stroke="var(--zoe-ink)" stroke-width="7" stroke-linecap="round"/>
            </g>

            <g data-part="eyes-concerned">
              <ellipse cx="65" cy="112" rx="11" ry="12" fill="var(--zoe-ink)"/>
              <ellipse cx="144" cy="96" rx="10.5" ry="11.5" fill="var(--zoe-ink)"/>
              <circle cx="61" cy="108" r="3.2" fill="var(--zoe-highlight)"/>
              <circle cx="140" cy="92" r="3.2" fill="var(--zoe-highlight)"/>
              <path d="M51 94C59 88 70 89 78 97" stroke="var(--zoe-ink)" stroke-width="5" stroke-linecap="round"/>
              <path d="M131 81C140 74 151 76 158 84" stroke="var(--zoe-ink)" stroke-width="5" stroke-linecap="round"/>
            </g>

            <g data-part="eyes-wide">
              <ellipse cx="65" cy="110" rx="13" ry="15" fill="var(--zoe-ink)"/>
              <ellipse cx="144" cy="94" rx="12.5" ry="14.5" fill="var(--zoe-ink)"/>
              <circle cx="61" cy="105" r="3.8" fill="var(--zoe-highlight)"/>
              <circle cx="140" cy="89" r="3.8" fill="var(--zoe-highlight)"/>
            </g>

            <g data-part="eyes-narrowed">
              <path d="M52 108C58 101 71 100 78 107C73 116 58 117 52 108Z" fill="var(--zoe-ink)"/>
              <path d="M131 92C138 85 151 85 157 92C152 101 137 102 131 92Z" fill="var(--zoe-ink)"/>
              <circle cx="61" cy="106" r="2.8" fill="var(--zoe-highlight)"/>
              <circle cx="140" cy="90" r="2.8" fill="var(--zoe-highlight)"/>
            </g>

            <g data-part="eyes-curious">
              <ellipse cx="65" cy="111" rx="11.5" ry="12.5" fill="var(--zoe-ink)"/>
              <ellipse cx="144" cy="95" rx="11" ry="12" fill="var(--zoe-ink)"/>
              <circle cx="62" cy="107" r="3.2" fill="var(--zoe-highlight)"/>
              <circle cx="147" cy="91" r="3.2" fill="var(--zoe-highlight)"/>
              <path d="M52 96C59 92 69 92 77 97" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M132 81C141 76 151 78 157 85" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>

            <g data-part="eyes-knowing">
              <ellipse cx="65" cy="111" rx="11.5" ry="12.5" fill="var(--zoe-ink)"/>
              <circle cx="61" cy="107" r="3.2" fill="var(--zoe-highlight)"/>
              <path d="M131 94C138 87 151 87 157 93C152 101 138 102 131 94Z" fill="var(--zoe-ink)"/>
              <circle cx="141" cy="91" r="2.7" fill="var(--zoe-highlight)"/>
              <path d="M52 96C60 92 70 93 77 98" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round"/>
              <path d="M132 83C141 80 151 81 157 86" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round"/>
            </g>

            <g data-part="eyes-blink">
              <path d="M52 110C59 115 71 114 78 107" stroke="var(--zoe-ink)" stroke-width="6" stroke-linecap="round"/>
              <path d="M131 94C138 99 151 98 157 91" stroke="var(--zoe-ink)" stroke-width="6" stroke-linecap="round"/>
            </g>

            <g data-part="brows-attentive">
              <path d="M53 99C61 94 70 94 77 99" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M132 85C140 80 150 80 157 85" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>

            <g data-part="tear">
              <path d="M160 111C160 111 154 119 154 123C154 127 157 130 160 130C164 130 167 127 167 123C167 119 160 111 160 111Z" fill="var(--zoe-highlight)" stroke="var(--zoe-ink)" stroke-width="2"/>
            </g>

            <g data-part="arm-right">
              <path d="M172.327 102.332C177.176 103.58 181.754 106.783 185.872 110.955C190.054 115.191 194.132 120.799 197.93 127.524C205.346 140.653 211.969 158.521 216.243 180.086C218.232 183.781 223.59 190.124 232.858 191.498C236.199 191.993 238.506 195.103 238.011 198.444C237.516 201.785 234.407 204.093 231.065 203.598C224.335 202.601 218.938 199.917 214.767 196.687C214.492 197.543 214.191 198.408 213.863 199.277C211.399 205.814 207.265 213.113 201.204 218.597C198.699 220.863 194.831 220.669 192.565 218.165C190.299 215.66 190.492 211.792 192.997 209.526C197.211 205.713 200.416 200.269 202.417 194.962C203.405 192.342 204.048 189.886 204.378 187.862C204.729 185.704 204.648 184.493 204.575 184.151C204.565 184.106 204.558 184.062 204.55 184.017L204.549 184.018C204.545 183.997 204.54 183.976 204.536 183.955C204.432 183.717 204.336 183.486 204.249 183.263C203.895 182.36 203.772 181.423 203.849 180.518C199.778 160.884 193.733 144.964 187.28 133.54C183.862 127.488 180.401 122.823 177.168 119.548C173.87 116.209 171.155 114.661 169.276 114.177L172.327 102.332Z" fill="var(--zoe-ink)"/>
            </g>

            <g data-part="mouths">
              <path data-part="mouth-rest" d="M85.7883 175.531C98.4282 180.831 122.607 184.949 145.114 163.91" stroke="var(--zoe-ink)" stroke-width="7.33926" stroke-linecap="round"/>
              <path data-part="mouth-wide" d="M81 172C97 183 125 187 150 159" stroke="var(--zoe-ink)" stroke-width="7.33926" stroke-linecap="round"/>
              <path data-part="mouth-open" d="M83.1972 167.987C84.8972 164.987 89.5372 164.987 93.9572 164.457C96.7872 164.137 101.457 162.737 110.777 159.957C120.097 157.177 129.777 153.177 131.327 152.527C138.677 149.457 143.387 147.037 146.197 149.197C146.547 149.467 147.397 150.197 148.147 153.117C149.195 157.65 148.991 162.382 147.557 166.807C144.307 178.207 142.677 183.907 138.367 188.717C134.405 193.148 129.345 196.456 123.697 198.307C120.827 199.197 113.747 201.307 105.887 198.507C100.077 196.457 96.4172 192.657 93.5572 189.697C92.4372 188.537 90.7272 186.187 87.2972 181.487C84.2972 177.417 83.0372 175.357 82.7072 172.427C82.3812 170.933 82.5533 169.374 83.1972 167.987Z" fill="var(--zoe-ink)"/>
              <path data-part="mouth-concerned" d="M88 176C101 160 126 159 143 172" stroke="var(--zoe-ink)" stroke-width="7" stroke-linecap="round"/>
              <path data-part="mouth-neutral" d="M94 172C107 174 124 171 138 164" stroke="var(--zoe-ink)" stroke-width="7" stroke-linecap="round"/>
              <path data-part="mouth-steady" d="M94 172C108 172 123 169 138 164" stroke="var(--zoe-ink)" stroke-width="7" stroke-linecap="round"/>
              <ellipse data-part="mouth-small-open" cx="116" cy="170" rx="10" ry="7" fill="var(--zoe-ink)"/>
              <path data-part="mouth-discomfort" d="M94 171C104 166 113 174 122 169C129 165 135 166 140 169" stroke="var(--zoe-ink)" stroke-width="6" stroke-linecap="round"/>
              <path data-part="mouth-questioning" d="M95 170C104 165 114 166 121 170C128 174 135 171 140 166" stroke="var(--zoe-ink)" stroke-width="6" stroke-linecap="round"/>
              <path data-part="mouth-hopeful" d="M96 168C108 177 127 174 140 162" stroke="var(--zoe-ink)" stroke-width="6" stroke-linecap="round"/>
            </g>

            <g data-part="arm-left">
              <path d="M36.3196 127.822C32.5037 129.833 29.3032 133.428 26.6809 137.744C24.0175 142.127 21.7151 147.639 19.8687 154.032C16.2642 166.512 14.2664 182.807 14.9729 201.733C14.0409 205.226 10.8116 211.611 3.31533 214.605C0.613201 215.685 -0.702046 218.751 0.377431 221.453C1.45714 224.155 4.52286 225.47 7.22508 224.391C12.6686 222.216 16.6588 218.892 19.5129 215.355C19.9141 216.018 20.3372 216.685 20.7848 217.348C24.1508 222.338 29.0679 227.633 35.239 231.024C37.7891 232.426 40.9928 231.494 42.3944 228.944C43.7957 226.394 42.8644 223.19 40.3141 221.789C36.0237 219.431 32.254 215.506 29.5216 211.455C28.1722 209.455 27.1442 207.524 26.4653 205.893C25.7424 204.155 25.569 203.124 25.5621 202.822C25.5612 202.782 25.5586 202.742 25.5569 202.703L25.558 202.703C25.5572 202.685 25.5567 202.666 25.5559 202.648C25.5953 202.428 25.6311 202.216 25.6599 202.012C25.7766 201.183 25.6934 200.373 25.4479 199.629C24.9553 182.362 26.8567 167.815 29.9931 156.956C31.6547 151.203 33.6282 146.605 35.6868 143.217C37.7865 139.761 39.7549 137.924 41.2335 137.144L36.3196 127.822Z" fill="var(--zoe-ink)"/>
            </g>
          </g>
          </g>

          <g data-part="sparkles">
            <g data-part="sparkle-left">
              <path d="M18 51V73M7 62H29" stroke="var(--zoe-ink)" stroke-width="4" stroke-linecap="round"/>
            </g>
            <g data-part="sparkle-upper-right">
              <path d="M212 31L216 42L227 46L216 50L212 61L208 50L197 46L208 42Z" fill="var(--zoe-green)" stroke="var(--zoe-ink)" stroke-width="2.5" stroke-linejoin="round"/>
            </g>
            <g data-part="sparkle-right">
              <path d="M225 122V142M215 132H235" stroke="var(--zoe-ink)" stroke-width="4" stroke-linecap="round"/>
            </g>
          </g>

          <g data-part="soft-accents">
            <g data-part="tension-left">
              <path d="M18 106L8 98M27 101L23 88" stroke="var(--zoe-ink)" stroke-width="4" stroke-linecap="round"/>
            </g>
            <g data-part="tension-right">
              <path d="M214 108C223 101 222 94 216 88M225 119C235 112 235 104 230 98" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <g data-part="heart-left">
              <path d="M20 91C18 87 8 81 8 73C8 66 17 63 21 70C25 61 35 65 35 72C35 80 26 87 20 91Z" fill="var(--zoe-green)" stroke="var(--zoe-ink)" stroke-width="2.5" stroke-linejoin="round"/>
            </g>
            <g data-part="heart-right">
              <path d="M218 87C216 83 207 77 207 70C207 63 216 61 220 68C224 59 233 63 233 70C233 77 224 84 218 87Z" fill="var(--zoe-green)" stroke="var(--zoe-ink)" stroke-width="2.5" stroke-linejoin="round"/>
            </g>
            <g data-part="orientation-left">
              <path d="M23 65V80M15 72.5H31" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <g data-part="orientation-right">
              <path d="M216 58L219 67L228 70L219 73L216 82L213 73L204 70L213 67Z" fill="var(--zoe-green)" stroke="var(--zoe-ink)" stroke-width="2.2" stroke-linejoin="round"/>
            </g>
            <g data-part="calm-arc">
              <path d="M69 230C92 244 146 244 171 225" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="7 8"/>
            </g>
            <g data-part="release-left">
              <path d="M24 139L12 133M27 150L12 151" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <g data-part="release-right">
              <path d="M217 133L230 126M219 145L234 144" stroke="var(--zoe-ink)" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <g data-part="acceptance-glint">
              <path d="M78 178V196M69 187H87" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round"/>
              <circle cx="78" cy="187" r="2.5" fill="var(--zoe-green)"/>
            </g>
            <g data-part="repair-glint">
              <path d="M194 172H216M209 165L216 172L209 179" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <g data-part="forward-glint-left">
              <path d="M180 178L194 172L187 187" fill="none" stroke="var(--zoe-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <g data-part="forward-glint-right">
              <path d="M208 148L222 141L216 156" fill="none" stroke="var(--zoe-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <g data-part="knowing-beat-left">
              <path d="M27 78V86M18 88L24 91" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round"/>
            </g>
            <g data-part="knowing-beat-right">
              <path d="M214 76V84M218 91L225 88" stroke="var(--zoe-ink)" stroke-width="3.2" stroke-linecap="round"/>
            </g>
          </g>
        </g>
      </svg>
    </div>
  `;
