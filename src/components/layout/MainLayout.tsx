import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf } from 'lucide-react';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const { t } = useLanguage();

	return (
		<div className='min-h-screen bg-earth-pale-green/50 flex'>
			<Sidebar
				open={sidebarOpen}
				setOpen={setSidebarOpen}
			/>
			<div
				className={cn(
					'flex-1 flex flex-col relative transition-all duration-300',
					sidebarOpen ? 'md:ml-64' : 'md:ml-20',
				)}
			>
				<TopNav onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className='flex-1 px-3 sm:px-4 md:px-5 lg:px-6 pt-20 pb-16 overflow-x-hidden'>
					<div className='max-w-7xl mx-auto w-full space-y-5 md:space-y-6'>
						{children}
					</div>
				</main>
				<footer className='py-3 px-3 sm:px-4 md:px-5 text-center text-sm text-earth-dark-green border-t bg-white shadow-sm w-full'>
					<div className='max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3'>
						<div className='flex items-center gap-2'>
							<Leaf className='h-4 w-4 text-earth-medium-green' />
							<p className='text-xs md:text-sm'>
								© 2025 TaniTrack -{' '}
								{t('app.name') === 'TaniTrack'
									? 'Blockchain-powered Agriculture Management System.'
									: 'Sistem Manajemen Pertanian berbasis Blockchain.'}
							</p>
						</div>
						<div className='flex items-center gap-2 md:gap-4'>
							<span className='text-xs bg-earth-light-green/20 text-earth-dark-green px-2 py-1 rounded-full'>
								{t('app.name') === 'TaniTrack'
									? 'Powered by Blockchain'
									: 'Didukung oleh Blockchain'}
							</span>
							<LanguageSwitcher />
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
