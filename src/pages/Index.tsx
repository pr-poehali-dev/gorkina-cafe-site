import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const { toast } = useToast();

  const menuItems = [
    { name: 'Говядина Веллингтон', image: 'https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/4dbc4bb8-36ea-4af4-a4a8-c62e53c8fd5e.jpg', description: 'Нежная говяжья вырезка в слоёном тесте с грибным дюксель' },
    { name: 'Паста с морепродуктами', image: 'https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/7c3352a1-40c2-4371-a1af-b6df74c37145.jpg', description: 'Лингвини с лобстером в сливочном соусе с пармезаном' },
    { name: 'Шоколадный фондан', image: 'https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/d460bc77-e307-4443-bf1e-64f28e869a71.jpg', description: 'Тёплый десерт с жидкой шоколадной начинкой и мороженым' },
  ];

  const galleryImages = [
    'https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/32565a64-a153-476d-935d-cbaebb6dcb5c.jpg',
    'https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/41c24c63-2f80-4f64-9cef-20850c82d5a3.jpg',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !guests || !name || !phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      date: format(date, 'yyyy-MM-dd'),
      time,
      guests: parseInt(guests),
      name,
      phone,
    };

    try {
      const response = await fetch('https://functions.poehali.dev/2170a17b-4b23-4be3-a4b3-fa4fd00892a3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        toast({
          title: "Бронирование успешно!",
          description: `Стол на ${guests} персон забронирован на ${format(date, 'd MMMM', { locale: ru })} в ${time}. SMS-уведомление будет отправлено на ${phone}`,
        });
        setDate(undefined);
        setTime('');
        setGuests('');
        setName('');
        setPhone('');
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Горькина</h1>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-8">
                <a href="#menu" className="hover:text-accent transition-colors">Меню</a>
                <a href="#about" className="hover:text-accent transition-colors">О нас</a>
                <a href="#booking" className="hover:text-accent transition-colors">Бронирование</a>
                <a href="#contacts" className="hover:text-accent transition-colors">Контакты</a>
              </nav>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90">
                    <Icon name="Menu" size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="Info" className="mr-2" size={16} />
                    О нас
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="UtensilsCrossed" className="mr-2" size={16} />
                    Меню
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="CalendarCheck" className="mr-2" size={16} />
                    Бронирование
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => document.getElementById('directions')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="MapPin" className="mr-2" size={16} />
                    Как добраться
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="MessageSquare" className="mr-2" size={16} />
                    Обратная связь
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Icon name="Phone" className="mr-2" size={16} />
                    Контакты
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/cdf2533d-2e56-4e2c-b23a-7c53ff045c7c/files/32565a64-a153-476d-935d-cbaebb6dcb5c.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">Добро пожаловать</h2>
          <p className="text-xl md:text-2xl mb-8 font-light">Место, где тепло встречаются традиции и уют</p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Забронировать столик
          </Button>
        </div>
      </section>

      <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">О кафе Горькина</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Кафе "Горькина" — это уютный уголок в самом сердце города, где вас ждёт домашняя атмосфера, 
              ароматный кофе и вкуснейшая выпечка. Мы создали пространство, где можно отдохнуть от городской 
              суеты, провести время с друзьями или насладиться моментом в одиночестве.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Наши блюда готовятся из свежих продуктов по домашним рецептам. Каждая чашка кофе — 
              это маленькое произведение искусства, созданное с любовью нашими бариста.
            </p>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Наше меню</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Coffee" className="text-primary" />
                  Напитки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Капучино</span>
                  <span className="font-semibold">8 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Латте</span>
                  <span className="font-semibold">9 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Эспрессо</span>
                  <span className="font-semibold">6 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Чай (ассорти)</span>
                  <span className="font-semibold">7 BYN</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Croissant" className="text-primary" />
                  Выпечка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Круассан</span>
                  <span className="font-semibold">5 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Яблочный штрудель</span>
                  <span className="font-semibold">7 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Чизкейк</span>
                  <span className="font-semibold">10 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Эклер</span>
                  <span className="font-semibold">6 BYN</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="UtensilsCrossed" className="text-primary" />
                  Завтраки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Омлет с травами</span>
                  <span className="font-semibold">11 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Сырники</span>
                  <span className="font-semibold">10 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Каша овсяная</span>
                  <span className="font-semibold">8 BYN</span>
                </div>
                <div className="flex justify-between">
                  <span>Тосты с авокадо</span>
                  <span className="font-semibold">12 BYN</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-8">Фирменные блюда</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {menuItems.map((item) => (
                <Dialog key={item.name}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer group">
                      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-end">
                          <div className="p-4 text-white">
                            <h4 className="text-xl font-bold">{item.name}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <div className="space-y-4">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full rounded-lg"
                      />
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Бронирование столика</h2>
            <p className="text-center text-muted-foreground mb-12">
              Забронируйте столик заранее, чтобы гарантированно получить место в удобное время
            </p>

            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Форма бронирования</CardTitle>
                <CardDescription>Заполните все поля для бронирования</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Дата</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Icon name="CalendarDays" className="mr-2 h-4 w-4" />
                            {date ? format(date, 'd MMMM', { locale: ru }) : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Время</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Время" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Гостей</Label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger id="guests">
                          <SelectValue placeholder="Количество" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-lg py-6" size="lg">
                    <Icon name="Check" className="mr-2" />
                    Забронировать столик
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Наш интерьер</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {galleryImages.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={image}
                      alt={`Интерьер кафе ${index + 1}`}
                      className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Icon name="ZoomIn" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img 
                    src={image}
                    alt={`Интерьер кафе ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      <section id="directions" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Как добраться</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Car" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">На автомобиле</h3>
                      <p className="text-muted-foreground">Парковка доступна рядом с кафе. Адрес для навигатора: г. Москва, ул. Пушкинская, д. 15</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Bus" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">На общественном транспорте</h3>
                      <p className="text-muted-foreground">Ближайшая станция метро: Пушкинская (5 минут пешком). Автобусы: №10, 25, 47 - остановка "Центральная площадь"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Clock" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Режим работы</h3>
                      <p className="text-muted-foreground">Ежедневно с 10:00 до 22:00. Бронирование столиков по телефону или через сайт</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="feedback" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Обратная связь</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Напишите нам</CardTitle>
                <CardDescription>Мы ценим ваше мнение и ответим в течение 24 часов</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-name">Ваше имя</Label>
                    <Input id="feedback-name" placeholder="Иван Иванов" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-email">Email</Label>
                    <Input id="feedback-email" type="email" placeholder="example@mail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-message">Сообщение</Label>
                    <textarea 
                      id="feedback-message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ваш отзыв или предложение..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Icon name="Send" className="mr-2" size={16} />
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Контакты</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="MapPin" className="text-primary" size={24} />
                </div>
                <CardTitle>Адрес</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  г. Москва,<br />
                  ул. Пушкинская, д. 15
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Phone" className="text-primary" size={24} />
                </div>
                <CardTitle>Телефон</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  +7 (495) 123-45-67<br />
                  Ежедневно 10:00-22:00
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Mail" className="text-primary" size={24} />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  info@gorkina.cafe<br />
                  Ответим в течение часа
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Горькина</h3>
          <p className="text-sm opacity-90">© 2024 Кафе Горькина. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;